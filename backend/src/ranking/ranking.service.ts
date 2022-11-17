import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import { Ranking } from './entities/ranking.entity';

@Injectable()
export class RankingService {
  constructor(@InjectRedis() private readonly redis: Redis) {}
  async getAll() {
    const redisSearchData = await this.redis.zrevrangebyscore(process.env.REDIS_POPULAR_KEY, '+inf', 1);
    const topTen = redisSearchData.slice(0, 10);
    const result: Ranking[] = [];
    topTen.map((v) => {
      const tmp: Ranking = { keyword: '', count: 0 };
      tmp.keyword = v;
      result.push(tmp);
    });
    return result;
  }
  async insertRedis(data: string) {
    const isRanking: string = await this.redis.zscore(process.env.REDIS_POPULAR_KEY, data);
    isRanking
      ? await this.redis.zadd(process.env.REDIS_POPULAR_KEY, Number(isRanking) + 1, data)
      : await this.redis.zadd(process.env.REDIS_POPULAR_KEY, 1, data);
  }
}
