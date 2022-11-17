import { Injectable } from '@nestjs/common';
import { Popular } from './entities/ranking.entity';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
@Injectable()
export class RankingService {
  constructor(@InjectRedis() private readonly redis: Redis) {}
  async getAll() {
    const topTen = await this.redis.zrevrangebyscore(process.env.REDIS_POPULAR_KEY, '+inf', 1);
    const scores = await Promise.all(
      topTen.map((v) => {
        return this.redis.zscore(process.env.REDIS_POPULAR_KEY, v);
      }),
    );
    return scores.map((score, i) => {
      //ToDo topTen 배열로만 변경
      const tmp: Popular = { keyword: topTen[i], count: Number(score) };
      return tmp;
    });
  }
  async insertRedis(data: string) {
    const isRanking: string = await this.redis.zscore(process.env.REDIS_POPULAR_KEY, data);
    isRanking
      ? await this.redis.zadd(process.env.REDIS_POPULAR_KEY, Number(isRanking) + 1, data)
      : await this.redis.zadd(process.env.REDIS_POPULAR_KEY, 1, data);
  }
}
