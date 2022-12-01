import { BadRequestException } from '@nestjs/common';
import { redisRanking } from '../entities/ranking.entity';
import redisMockData from './rankingData.mock';
export function mockRedisService() {
  const insertRedis = jest.fn(async (keyword: string) => {
    if (keyword === '') throw new BadRequestException({ status: 400, error: 'bad request' });
    for (const data of redisMockData) {
      if (data.keyword === keyword) {
        data[keyword]++;
        return 'update';
      }
    }
    return 'new';
  });
  const getTen = jest.fn().mockResolvedValue(redisMockData.slice(0, 10));
  const redisService = { insertRedis, getTen };
  return redisService;
}
