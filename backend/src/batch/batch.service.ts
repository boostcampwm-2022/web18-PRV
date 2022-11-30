import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { HttpService } from '@nestjs/axios';
import { Interval } from '@nestjs/schedule';
import Redis from 'ioredis';
import { SearchService } from 'src/search/search.service';
import { TIME_INTERVAL, SEARCH_BATCH_SIZE, DOI_BATCH_SIZE } from './batch.config';
import { DoiBatcher } from './batcher.doi';
import { SearchBatcher } from './batcher.search';

export class BatchService {
  searchBatcher: SearchBatcher;
  doiBatcher: DoiBatcher;
  constructor(
    @InjectRedis() private readonly redis: Redis,
    private readonly httpService: HttpService,
    private readonly searchService: SearchService,
  ) {
    this.searchBatcher = new SearchBatcher(
      this.redis,
      this.httpService.axiosRef,
      this.searchService,
      'url batch queue',
    );
    this.doiBatcher = new DoiBatcher(this.redis, this.httpService.axiosRef, this.searchService, 'paper batch queue');
  }
  async keywordExist(keyword: string) {
    return (await this.redis.ttl(keyword)) >= 0;
  }
  async setKeyword(keyword: string) {
    if (await this.keywordExist(keyword)) return false;
    this.redis.set(keyword, 1);
    this.redis.expire(keyword, 60 * 60 * 24);
    this.searchBatcher.pushToQueue(0, 0, -1, true, keyword);
    return true;
  }
  async setDoi(doi: string) {
    this.doiBatcher.pushToQueue(0, 0, -1, true, doi);
  }

  @Interval(TIME_INTERVAL)
  async batchSearchQueue(batchSize = SEARCH_BATCH_SIZE) {
    const referencesDoiWithDepth = await this.searchBatcher.runBatch(batchSize);
    referencesDoiWithDepth?.forEach((v) => {
      this.doiBatcher.pushToQueue(0, v.depth + 1, -1, false, v.doi);
    });
  }

  @Interval(TIME_INTERVAL)
  async batchDoiQueue(batchSize = DOI_BATCH_SIZE) {
    const referencesDoiWithDepth = await this.doiBatcher.runBatch(batchSize);
    referencesDoiWithDepth?.forEach((v) => {
      this.doiBatcher.pushToQueue(0, v.depth + 1, -1, false, v.doi);
    });
  }
}
