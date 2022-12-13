import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { HttpService } from '@nestjs/axios';
import { Interval } from '@nestjs/schedule';
import Redis from 'ioredis';
import { SHOULD_RUN_BATCH } from 'src/envLayer';
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
  keywordToRedisKey(keyword: string) {
    return `s:${keyword}`;
  }
  async keywordExist(keyword: string) {
    const lowercased = keyword.toLowerCase();
    const key = this.keywordToRedisKey(lowercased);
    return (await this.redis.ttl(key)) >= 0;
  }
  async setKeyword(keyword: string) {
    if (!SHOULD_RUN_BATCH) return false;
    const lowercased = keyword.toLowerCase();
    if (await this.keywordExist(lowercased)) return false;
    const key = this.keywordToRedisKey(lowercased);
    this.redis.set(key, 1);
    this.redis.expire(key, 60 * 60 * 24);
    return true;
  }

  @Interval(TIME_INTERVAL)
  batchSearchQueue(batchSize = SEARCH_BATCH_SIZE) {
    this.searchBatcher.runBatch(batchSize);
  }

  @Interval(TIME_INTERVAL)
  async batchDoiQueue(batchSize = DOI_BATCH_SIZE) {
    const referencesDoiWithDepth = await this.doiBatcher.runBatch(batchSize);
    referencesDoiWithDepth?.forEach((v) => {
      this.doiBatcher.pushToQueue(0, v.depth + 1, -1, false, v.doi);
    });
  }
}
