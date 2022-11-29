import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import Redis from 'ioredis';
import {
  CrossRefItem,
  CrossRefPaperResponse,
  CrossRefResponse,
  ReferenceInfo,
} from 'src/search/entities/crossRef.entity';
import { SearchService } from 'src/search/search.service';
import { CROSSREF_API_PAPER_URL, CROSSREF_API_URL_CURSOR, MAX_ROWS } from 'src/util';
import { RedisQueue } from './batch.queue';

const MAX_RETRY = 3;
const URL_BATCH_SIZE = 10;
const PAPER_BATCH_SIZE = 40;
const TIME_INTERVAL = 2 * 1000;

@Injectable()
export class BatchService {
  urlQueue: RedisQueue;
  urlFailedQueue: RedisQueue;
  paperQueue: RedisQueue;
  paperFailedQueue: RedisQueue;

  constructor(
    @InjectRedis() private readonly redis: Redis,
    private readonly httpService: HttpService,
    private readonly searchService: SearchService,
  ) {
    this.urlQueue = new RedisQueue(redis, 'urlQueue');
    this.urlFailedQueue = new RedisQueue(redis, 'urlFailedQueue');
    this.paperQueue = new RedisQueue(redis, 'paperQueue');
    this.paperFailedQueue = new RedisQueue(redis, 'paperFailedQueue');
  }

  async keywordExist(keyword: string) {
    return (await this.redis.ttl(keyword)) !== -2;
  }
  async setKeyword(keyword: string) {
    if (await this.keywordExist(keyword)) return false;
    this.redis.set(keyword, 1);
    this.redis.expire(keyword, 60 * 60 * 24);
    this.pushToUrlQueue(keyword);
    return true;
  }

  parseQueueItem(value: string) {
    const splits = value.split(':');
    return { retries: parseInt(splits[0]), url: splits.slice(1).join(':') };
  }

  pushToUrlQueue(keyword: string, retries = 0, cursor = '*') {
    const url = CROSSREF_API_URL_CURSOR(keyword, cursor);
    this.urlQueue.push(`${retries}:${url}`, cursor === '*');
  }

  pushToPaperQueue(doi: string, retries = 0) {
    const url = CROSSREF_API_PAPER_URL(doi);
    this.paperQueue.push(`${retries}:${url}`);
  }

  fetch<T = CrossRefResponse>(url: string) {
    return this.httpService.axiosRef.get<T>(url);
  }

  @Interval(TIME_INTERVAL)
  async runUrlQueueCrawler(batchSize = URL_BATCH_SIZE) {
    const queue = this.urlQueue;
    const failedQueue = this.urlFailedQueue;
    const batched = await queue.pop(batchSize);
    if (!batched) return;
    const items = batched.map((value) => this.parseQueueItem(value));
    const responses = await Promise.allSettled(items.map((item) => this.fetch(item.url)));
    const bulk = responses
      .flatMap((res, i) => {
        const url = new URL(items[i].url);
        const params = new URLSearchParams(url.search);
        const keyword = params.get('query');
        const presentCursor = params.get('cursor');
        if (res.status === 'fulfilled') {
          if (presentCursor === '*') {
            const cursor = res.value.data.message['next-cursor'];
            const maxPage = Math.ceil(res.value.data.message['total-results'] / MAX_ROWS);
            Array.from({ length: maxPage - 1 }, () => {
              this.pushToUrlQueue(keyword, 0, cursor);
            });
          }
          return this.getValidatedPapers(res.value.data.message.items);
        } else {
          if (items[i].retries + 1 > MAX_RETRY) {
            failedQueue.push(items[i].url);
            return;
          }
          items[i].retries++;
          this.pushToUrlQueue(params.get('query'), items[i].retries + 1);
          return;
        }
      })
      .filter(Boolean);
  }

  @Interval(TIME_INTERVAL)
  async runPaperQueueCrawler(batchSize = PAPER_BATCH_SIZE) {
    const queue = this.paperQueue;
    const failedQueue = this.paperFailedQueue;
    const batched = await queue.pop(batchSize);
    if (!batched) return;
    const items = batched.map((value) => this.parseQueueItem(value));
    const responses = await Promise.allSettled(items.map((item) => this.fetch<CrossRefPaperResponse>(item.url)));
    const bulk = responses
      .map((res, i) => {
        const url = new URL(items[i].url);
        const doi = url.pathname.split('/').slice(2).join('/');
        if (res.status === 'fulfilled') {
          const item = res.value.data.message;
          if (this.shouldParsePaper(item)) {
            return this.searchService.parsePaperInfoDetail(item);
          }
        } else {
          if (items[i].retries + 1 > MAX_RETRY) {
            failedQueue.push(items[i].url);
          }
          this.pushToPaperQueue(doi, items[i].retries + 1);
          return;
        }
      })
      .filter(Boolean);
    // TODO: bulk insert
  }

  getValidatedPapers(items: CrossRefItem[]) {
    return items
      .flatMap((item) => {
        if (this.shouldParsePaper(item)) {
          return this.searchService.parsePaperInfoDetail(item);
        }
      })
      .filter(Boolean);
  }

  shouldParsePaper(item: CrossRefItem) {
    if (this.paperHasInformation(item)) {
      item.reference?.forEach((ref) => {
        // 적절한 information이 없고, doi도 없는 reference는 무시된다.
        if (!this.referenceHasInformation(ref) && ref.DOI) {
          this.pushToPaperQueue(ref.DOI, 0);
        }
      });
      return true;
    }
    if (item.DOI) {
      this.pushToPaperQueue(item.DOI);
    }
    return false;
  }

  paperHasInformation(paper: CrossRefItem) {
    return paper.DOI && paper.title;
  }

  referenceHasInformation(reference: ReferenceInfo) {
    return reference['article-title'];
  }
  redisStatistics() {
    const keys = ['urlQueueLength', 'urlFailedLength', 'paperQueueLength', 'paperFailedLength'];
    return Promise.all(
      keys.map(async (key) => {
        return { [key]: await this.redis.lrange(key, 0, -1) };
      }),
    );
  }
}

/**
 * 최초에 db에 입력된 데이터의 개수가 너무 적을 때에는, 사용자가 검색한 키워드에 의해 전체 db의 성향이 바뀐다고 볼 수 있다.
 * 따라서 최초에 입력한 키워드에 모든 검색결과가 맞춰지고, 이는 검색의 질이 떨어진다는 느낌을 가져온다.
 * 사용자가 검색할 때마다 시스템이 진화하도록 설계할 수 있을 것이다.
 * Crossref에 있는 모든 논문을 다 가져오는 것은, 컴퓨터 자원 문제로 인해 불가능하다.
 * doi 하나당 32byte라하면, 1GB에 3천만개정도의 key를 집어넣을 수 있다.
 * 지금은 무한 depth로 들어가는데, 이 depth를 조정하는 방법이 있을 수 있다.
 * retry:depth:url 형태 -> 원본에서 depth 1까지만 해도 무리갈 것 같다.
 */
