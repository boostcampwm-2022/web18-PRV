import { AxiosInstance, AxiosResponse } from 'axios';
import Redis from 'ioredis';
import { CrossRefResponse } from 'src/search/entities/crossRef.entity';
import { SearchService } from 'src/search/search.service';
import { CROSSREF_API_URL_CURSOR, MAX_ROWS } from 'src/util';
import { MAX_RETRY } from './batch.config';
import { Batcher, QueueItemParsed, UrlParams } from './batcher.abstract';

export class SearchBatcher extends Batcher {
  constructor(redis: Redis, axios: AxiosInstance, searchService: SearchService, name: string) {
    super(redis, axios, searchService, name);
  }

  makeUrl(keyword: string, cursor: string) {
    return CROSSREF_API_URL_CURSOR(keyword, cursor);
  }

  getParamsFromUrl(url: string): UrlParams {
    const u = new URL(url);
    const params = new URLSearchParams(u.search);
    const keyword = params.get('query');
    const cursor = params.get('cursor') || '*';
    return { keyword, cursor };
  }
  validateBatchItem(item: QueueItemParsed): boolean {
    return true;
  }
  onFulfilled(item: QueueItemParsed, params: UrlParams, res: AxiosResponse<CrossRefResponse, any>) {
    const { cursor: presentCursor, keyword } = params;
    if (presentCursor === '*') {
      const cursor = res.data.message['next-cursor'];
      const maxPage = Math.floor(res.data.message['total-results'] / MAX_ROWS);
      this.pushToQueue(0, item.depth + 1, maxPage, true, keyword, cursor);
    } else if (item.pagesLeft > 0) {
      this.pushToQueue(0, item.depth, item.pagesLeft - 1, false, keyword, presentCursor);
    }
    const referenceDOIs = res.data.message.items.flatMap((paper) => {
      return this.getPapersToRequest(paper, item.depth);
    });
    const papers = res.data.message.items.map((paper) => {
      return this.searchService.parsePaperInfoDetail(paper);
    });
    return { papers, referenceDOIs };
  }

  onRejected(item: QueueItemParsed, params: UrlParams) {
    const { keyword, cursor } = params;
    if (item.retries + 1 > MAX_RETRY) {
      // this.failedQueue.push(item.url);
      return;
    }
    // console.log('error', item.url);
    item.retries++;
    this.pushToQueue(item.retries + 1, item.depth, item.pagesLeft - 1, false, keyword, cursor);
    return;
  }
}
