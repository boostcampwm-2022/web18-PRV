import { GetGetResult } from '@elastic/elasticsearch/lib/api/types';
import { Injectable } from '@nestjs/common';
import { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import Redis from 'ioredis';
import {
  CrossRefItem,
  CrossRefPaperResponse,
  CrossRefResponse,
  PaperInfoDetail,
  ReferenceInfo,
} from 'src/search/entities/crossRef.entity';
import { SearchService } from 'src/search/search.service';
import { ALLOW_UPDATE, MAX_DEPTH, RESTART_INTERVAL } from './batch.config';
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
  static blocked = false;
  running = false;

  queue: RedisQueue;
  // failedQueue: RedisQueue;
  constructor(
    private readonly redis: Redis,
    private readonly axios: AxiosInstance,
    readonly searchService: SearchService,
    readonly name: string,
  ) {
    this.queue = new RedisQueue(this.redis, name);
    // this.failedQueue = new RedisQueue(this.redis, name);
  }
  abstract makeUrl(...params: string[]): string;
  abstract getParamsFromUrl(url: string): UrlParams;
  abstract onFulfilled(
    item: QueueItemParsed,
    params: UrlParams,
    res: AxiosResponse<CrossRefAble, any>,
    i?: number,
  ): { papers: PaperInfoDetail[]; referenceDOIs: string[] }; // paper들의 reference들에 대한 doi 목록
  abstract onRejected(
    item: QueueItemParsed,
    params: UrlParams,
    shouldPushLeft?: boolean,
    res?: PromiseRejectedResult,
    i?: number,
  ): any;
  abstract validateBatchItem(item: QueueItemParsed): boolean;

  parseQueueItem(value: string) {
    const splits = value.split(':');
    return {
      retries: parseInt(splits[0]),
      depth: parseInt(splits[1]),
      pagesLeft: parseInt(splits[2]),
      url: splits.slice(3).join(':'),
    } as QueueItemParsed;
  }

  pushToQueue(retries = 0, depth = 0, page = -1, shouldPushLeft = false, ...params: string[]) {
    const url = this.makeUrl(...params);
    this.queue.push(`${retries}:${depth}:${page}:${url}`, shouldPushLeft);
  }
  async batchLog(queue: RedisQueue, batched: string[]) {
    const queueSize = await queue.size();
    const batchedSize = batched?.length || 0;
    (queueSize || batchedSize) && console.log(`${queue.name} size`, queueSize, ', batch size ', batchedSize);
  }
  fetchCrossRef<T = CrossRefAble>(url: string) {
    return this.axios.get<T>(url);
  }

  async runBatch(batchSize: number) {
    if (Batcher.blocked || this.running) return;
    const queue = this.queue;
    // const failedQueue = this.failedQueue;
    const batched = await queue.pop(batchSize);
    // await this.batchLog(queue, batched);
    if (!batched) return;
    this.running = true;

    const items = batched.map((item) => this.parseQueueItem(item)).filter((item) => this.validateBatchItem(item));
    const responses = await this.batchRequest(items);
    const { papers, doiWithDepth } = this.responsesParser(items, responses);
    const bulkPapers = await this.makeBulkIndex(papers);
    this.doBulkInsert(bulkPapers);

    this.running = false;
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
          if (Batcher.blocked) {
            this.onRejected(items[i], params, true, res, i);
            return;
          }

          const error = res.reason as AxiosError;
          // Resource not found.
          if (error.response?.status === 404) {
            return;
          }

          // Too many request
          if (error.response?.status === 429) {
            this.stopBatch();
          }

          // Timeout exceeded
          this.onRejected(items[i], params, false, res, i);
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
    if (ALLOW_UPDATE) return papers;
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

    // console.log(`${this.queue.name} skipped papers:`, papers.length - indexes.length);
    return indexes;
  }
  doBulkInsert(papers: PaperInfoDetail[]) {
    return this.searchService.bulkInsert(papers);
  }

  getPapersReferences(item: CrossRefItem, depth: number) {
    const hasHope = this.paperHasInformation(item);
    const dois: string[] = [];
    if (hasHope && depth + 1 < MAX_DEPTH) {
      item.reference?.forEach((ref) => {
        // doi가 있는 reference는 다음 paperQueue에 집어넣는다.
        if (this.referenceHasInformation(ref)) {
          dois.push(ref.DOI);
        }
      });
    }
    return dois;
  }

  paperHasInformation(paper: CrossRefItem) {
    // DOI와 제목이 있는 논문만 db에 저장한다.
    return paper.DOI && paper.title;
  }

  referenceHasInformation(reference: ReferenceInfo) {
    return reference['DOI'];
  }

  stopBatch() {
    Batcher.blocked = true;
    console.log(`${new Date()} Too many request.`);
    setTimeout(() => {
      Batcher.blocked = false;
      console.log(`${new Date()} Batch Restarted`);
    }, RESTART_INTERVAL);
  }
}
