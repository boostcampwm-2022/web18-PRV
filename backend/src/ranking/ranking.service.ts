import { BadRequestException, HttpException, HttpStatus, Injectable, UsePipes, ValidationPipe } from '@nestjs/common';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import { Ranking } from './entities/ranking.entity';
import { Interval } from '@nestjs/schedule';

@Injectable()
export class RankingService {
  constructor(@InjectRedis() private readonly redis: Redis) {}
  async getTen() {
    const redisSearchData = await this.redis.zrevrangebyscore(process.env.REDIS_POPULAR_KEY, '+inf', 1);
    const topTen = redisSearchData.slice(0, 10);
    const result: Ranking[] = [];
    await Promise.all(
      topTen.map(async (v, i) => {
        const tmp: Ranking = { keyword: '', changeRanking: 0 };
        tmp.keyword = v;
        const prevrank = await this.redis.zscore(process.env.REDIS_PREVRANKING, v);
        prevrank ? (tmp.changeRanking = Number(prevrank) - i) : (tmp.changeRanking = null);
        result.push(tmp);
      }),
    );
    return result;
  }
  @UsePipes(new ValidationPipe({ transform: true }))
  async insertRedis(data: string) {
    if (data === '' || data.length <= 2) throw new BadRequestException();
    const encodeData = decodeURI(data);
    try {
      const isRanking: string = await this.redis.zscore(process.env.REDIS_POPULAR_KEY, encodeData);
      isRanking
        ? await this.redis.zadd(process.env.REDIS_POPULAR_KEY, Number(isRanking) + 1, encodeData)
        : await this.redis.zadd(process.env.REDIS_POPULAR_KEY, 1, encodeData);
    } catch (error) {
      throw new HttpException('Internel Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @Interval('update-ranking', 600000)
  async updateRanking() {
    const redisSearchData = await this.redis.zrevrangebyscore(process.env.REDIS_POPULAR_KEY, '+inf', 1);
    const topTen = redisSearchData.slice(0, 100);
    await this.redis.del(process.env.REDIS_PREVRANKING);
    await Promise.all(
      topTen.map(async (v, i) => {
        await this.redis.zadd(process.env.REDIS_PREVRANKING, i, v);
      }),
    );
  }
}
