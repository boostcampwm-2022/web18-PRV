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
const MAX_DEPTH = 1;
const URL_BATCH_SIZE = 10;
const PAPER_BATCH_SIZE = 40;
const TIME_INTERVAL = 3 * 1000;

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
    return (await this.redis.ttl(keyword)) >= 0;
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
    return {
      retries: parseInt(splits[0]),
      depth: parseInt(splits[1]),
      pages: parseInt(splits[2]),
      url: splits.slice(3).join(':'),
    };
  }

  pushToUrlQueue(keyword: string, retries = 0, depth = 0, page = -1, cursor = '*') {
    const url = CROSSREF_API_URL_CURSOR(keyword, cursor);
    this.urlQueue.push(`${retries}:${depth}:${page}:${url}`, cursor === '*');
  }

  pushToPaperQueue(doi: string, retries = 0, depth = 0, page = 0) {
    const url = CROSSREF_API_PAPER_URL(doi);
    this.paperQueue.push(`${retries}:${depth}:${page}:${url}`);
  }

  fetch<T = CrossRefResponse>(url: string) {
    return this.httpService.axiosRef.get<T>(url);
  }

  @Interval(TIME_INTERVAL)
  async runUrlQueueCrawler(batchSize = URL_BATCH_SIZE) {
    const queue = this.urlQueue;
    const failedQueue = this.urlFailedQueue;
    const batched = await queue.pop(batchSize);
    console.log('urlQueue size', await queue.size());
    if (!batched) return;
    const items = batched.map((value) => this.parseQueueItem(value));
    const responses = await Promise.allSettled(items.map((item) => this.fetch(item.url)));
    const bulk = responses
      .flatMap((res, i) => {
        const referenceDepth = items[i].depth;
        const retries = items[i].retries;
        const pageLeft = items[i].pages;
        const url = new URL(items[i].url);
        const params = new URLSearchParams(url.search);
        const keyword = params.get('query');
        const presentCursor = params.get('cursor');
        if (res.status === 'fulfilled') {
          if (presentCursor === '*') {
            const cursor = res.value.data.message['next-cursor'];
            const maxPage = Math.floor(res.value.data.message['total-results'] / MAX_ROWS);
            this.pushToUrlQueue(keyword, 0, referenceDepth + 1, maxPage, cursor);
          } else if (pageLeft > 0) {
            this.pushToUrlQueue(keyword, 0, referenceDepth, pageLeft - 1, presentCursor);
          }
          return this.getValidatedPapers(res.value.data.message.items, referenceDepth);
        } else {
          if (items[i].retries + 1 > MAX_RETRY) {
            failedQueue.push(items[i].url);
            return;
          }
          console.log('error', items[i].url);
          items[i].retries++;
          const query = params.get('query');
          const cursor = params.get('cursor') || '*';
          this.pushToUrlQueue(query, retries + 1, referenceDepth, pageLeft - 1, cursor); // 실패해도,, cursor가 움직였다.
          return;
        }
      })
      .filter(Boolean);
    console.log('filtered: ', bulk.length);
    this.redis.rpush('urlQueueLength', await queue.size());
    this.redis.rpush('urlQueueTime', Date.now());
  }

  @Interval(TIME_INTERVAL)
  async runPaperQueueCrawler(batchSize = PAPER_BATCH_SIZE) {
    const queue = this.paperQueue;
    const failedQueue = this.paperFailedQueue;
    const batched = await queue.pop(batchSize);
    console.log('paperQueue size', await queue.size());
    if (!batched) return;
    const items = batched.map((value) => this.parseQueueItem(value));
    const responses = await Promise.allSettled(items.map((item) => this.fetch<CrossRefPaperResponse>(item.url)));
    const bulk = responses
      .map((res, i) => {
        const referenceDepth = items[i].depth;
        const url = new URL(items[i].url);
        const doi = url.pathname.split('/').slice(2).join('/');
        // TODO: 우리 db에 해당 doi가 존재한다면 굳이 또?
        if (res.status === 'fulfilled') {
          const item = res.value.data.message;
          if (this.shouldParsePaper(item, referenceDepth)) {
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
    this.redis.rpush('paperQueueLength', await queue.size());
    this.redis.rpush('paperQueueTime', Date.now());
    // TODO: bulk insert
  }

  getValidatedPapers(items: CrossRefItem[], depth: number) {
    return items
      .flatMap((item) => {
        if (this.shouldParsePaper(item, depth)) {
          return this.searchService.parsePaperInfoDetail(item);
        }
      })
      .filter(Boolean);
  }

  shouldParsePaper(item: CrossRefItem, depth: number) {
    const hasHope = this.paperHasInformation(item);
    if (hasHope && depth < MAX_DEPTH) {
      if (item.DOI) {
        this.pushToPaperQueue(item.DOI, 0, depth + 1);
      }
      item.reference?.forEach((ref) => {
        // doi가 있는 reference에 대해 paperQueue에 집어넣는다.
        if (this.referenceHasInformation(ref)) {
          this.pushToPaperQueue(ref.DOI, 0, depth + 1);
        }
      });
    }
    return hasHope;
  }

  paperHasInformation(paper: CrossRefItem) {
    // DOI와 제목이 있는 논문만 db에 저장한다.
    return paper.DOI && paper.title;
  }

  referenceHasInformation(reference: ReferenceInfo) {
    return reference['DOI'];
  }
}
