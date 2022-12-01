import { AxiosInstance, AxiosResponse } from 'axios';
import Redis from 'ioredis';
import { CrossRefPaperResponse, PaperInfoDetail } from 'src/search/entities/crossRef.entity';
import { SearchService } from 'src/search/search.service';
import { CROSSREF_API_PAPER_URL } from 'src/util';
import { DOI_REGEXP, MAX_RETRY } from './batch.config';
import { Batcher, UrlParams, QueueItemParsed } from './batcher.abstract';

export class DoiBatcher extends Batcher {
  constructor(redis: Redis, axios: AxiosInstance, searchService: SearchService, name: string) {
    super(redis, axios, searchService, name);
  }
  makeUrl(doi: string) {
    return CROSSREF_API_PAPER_URL(doi);
  }
  getParamsFromUrl(url: string): UrlParams {
    const u = new URL(url);
    const doi = u.pathname.replace(/\/works\//, '');
    return { doi };
  }
  validateBatchItem(item: QueueItemParsed): boolean {
    const { doi } = this.getParamsFromUrl(item.url);
    // DOI 대문자일 경우 검색 안 되는 경우 발생
    item.url = item.url.toLowerCase();
    return DOI_REGEXP.test(doi);
  }
  onFulfilled(
    item: QueueItemParsed,
    params: UrlParams,
    res: AxiosResponse<CrossRefPaperResponse, any>,
  ): { papers: PaperInfoDetail[]; referenceDOIs: string[] } {
    const paper = res.data.message;
    const { depth } = item;
    const referenceDOIs = this.getPapersToRequest(paper, depth);
    const p = this.searchService.parsePaperInfoDetail(paper);
    return { papers: [p], referenceDOIs };
  }

  onRejected(item: QueueItemParsed, params: UrlParams) {
    const { doi } = params;
    if (item.retries + 1 > MAX_RETRY) {
      // this.failedQueue.push(item.url);
      return;
    }
    console.log('error', item.url);
    item.retries++;
    this.pushToQueue(item.retries + 1, item.depth, item.pagesLeft - 1, false, doi);
    return;
  }
}
