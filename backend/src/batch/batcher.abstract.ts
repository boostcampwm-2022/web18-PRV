import { GetGetResult } from '@elastic/elasticsearch/lib/api/types';
import { Injectable } from '@nestjs/common';
import { AxiosInstance, AxiosResponse } from 'axios';
import Redis from 'ioredis';
import {
  CrossRefItem,
  CrossRefPaperResponse,
  CrossRefResponse,
  PaperInfoDetail,
  ReferenceInfo,
} from 'src/search/entities/crossRef.entity';
import { SearchService } from 'src/search/search.service';
import { MAX_DEPTH } from './batch.config';
import { RedisQueue } from './batch.queue';

export interface QueueItemParsed {
  retries: number;
  depth: number;
  pagesLeft: number;
  url: string;
}
export interface UrlParams {
  doi?: string;
  keyword?: string;
  cursor?: string;
}

type CrossRefAble = CrossRefResponse | CrossRefPaperResponse;

@Injectable()
export abstract class Batcher {
  queue: RedisQueue;
  failedQueue: RedisQueue;
  constructor(
    private readonly redis: Redis,
    private readonly axios: AxiosInstance,
    readonly searchService: SearchService,
    readonly name: string,
  ) {
    this.queue = new RedisQueue(redis, name);
    this.failedQueue = new RedisQueue(redis, name);
  }
  abstract makeUrl(...params: string[]): string;
  abstract getParamsFromUrl(url: string): UrlParams;
  abstract onFulfilled(
    item: QueueItemParsed,
    params: UrlParams,
    res: AxiosResponse<CrossRefAble, any>,
    i?: number,
  ): { papers: PaperInfoDetail[]; referenceDOIs: string[] }; // paper들의 reference들에 대한 doi 목록
  abstract onRejected(item: QueueItemParsed, params: UrlParams, res?: PromiseRejectedResult, i?: number): any;

  async keywordExist(keyword: string) {
    return (await this.redis.ttl(keyword)) >= 0;
  }
  async setKeyword(keyword: string) {
    if (await this.keywordExist(keyword)) return false;
    this.redis.set(keyword, 1);
    this.redis.expire(keyword, 60 * 60 * 24);
    this.pushToQueue(0, 0, -1, false, keyword);
    return true;
  }

  parseQueueItem(value: string) {
    const splits = value.split(':');
    return {
      retries: parseInt(splits[0]),
      depth: parseInt(splits[1]),
      pagesLeft: parseInt(splits[2]),
      url: splits.slice(3).join(':'),
    } as QueueItemParsed;
  }

  pushToQueue(retries = 0, depth = 0, page = -1, pushLeft = false, ...params: string[]) {
    const url = this.makeUrl(...params);
    this.queue.push(`${retries}:${depth}:${page}:${url}`, pushLeft);
  }
  async batchLog(queue: RedisQueue, batched: string[]) {
    const urlQueueSize = await queue.size();
    const batchedSize = batched?.length || 0;
    (urlQueueSize || batchedSize) && console.log(`${queue.name} size`, urlQueueSize, ', batch size ', batchedSize);
  }
  fetchCrossRef<T = CrossRefAble>(url: string) {
    return this.axios.get<T>(url);
  }

  async runBatch<T = CrossRefAble>(batchSize: number) {
    const queue = this.queue;
    const failedQueue = this.failedQueue;
    const batched = await queue.pop(batchSize);

    await this.batchLog(queue, batched);
    if (!batched) return;

    const items = batched.map((value) => this.parseQueueItem(value));
    const responses = await this.batchRequest(items);
    const { papers, doiWithDepth } = this.responsesParser(items, responses);
    const bulkPapers = await this.makeBulkIndex(papers);
    this.doBulkIndex(bulkPapers);
    return doiWithDepth;
  }
  batchRequest<T = CrossRefAble>(items: QueueItemParsed[]) {
    return Promise.allSettled(items.map((item) => this.fetchCrossRef<T>(item.url)));
  }

  responsesParser(items: QueueItemParsed[], responses: PromiseSettledResult<AxiosResponse<CrossRefAble, any>>[]) {
    return responses
      .map((res, i) => {
        const params = this.getParamsFromUrl(items[i].url);
        if (res.status === 'fulfilled') {
          return this.onFulfilled(items[i], params, res.value, i);
        } else {
          this.onRejected(items[i], params, res, i);
          return;
        }
      })
      .reduce(
        (acc, cur, i) => {
          if (cur?.papers) Array.prototype.push.apply(acc.papers, cur.papers);
          if (cur?.referenceDOIs) {
            const doiWithDepth = cur.referenceDOIs.map((doi) => {
              return { doi, depth: items[i].depth };
            });
            Array.prototype.push.apply(acc.doiWithDepth, doiWithDepth);
          }
          return acc;
        },
        { papers: [], doiWithDepth: [] as { doi: string; depth: number }[] },
      );
  }

  async makeBulkIndex(papers: PaperInfoDetail[]): Promise<PaperInfoDetail[]> {
    const dois = papers.map((paper) => {
      return paper.doi;
    });
    const { docs } = await this.searchService.multiGet(dois);
    const indexes = docs
      .map((doc, i) => {
        if ((doc as GetGetResult).found) return;
        return papers[i];
      })
      .filter(Boolean);

    console.log(`${this.queue.name} skipped papers:`, papers.length - indexes.length);
    return indexes;
  }
  doBulkIndex(papers: PaperInfoDetail[]) {
    return this.searchService.bulkInsert(papers);
  }

  getPapersToRequest(item: CrossRefItem, depth: number) {
    const hasHope = this.paperHasInformation(item);
    const papers: string[] = [];
    if (hasHope && depth < MAX_DEPTH) {
      if (item.DOI) {
        papers.push(item.DOI);
      }
      item.reference?.forEach((ref) => {
        // doi가 있는 reference에 대해 paperQueue에 집어넣는다.
        if (this.referenceHasInformation(ref)) {
          // return [ref.DOI, 0, depth + 1];
          papers.push(ref.DOI);
        }
      });
    }
    return papers;
  }

  paperHasInformation(paper: CrossRefItem) {
    // DOI와 제목이 있는 논문만 db에 저장한다.
    return paper.DOI && paper.title;
  }

  referenceHasInformation(reference: ReferenceInfo) {
    return reference['DOI'];
  }
}
