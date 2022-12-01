import { BadRequestException } from '@nestjs/common';
import { redisRanking } from '../entities/ranking.entity';
import redisMockData from './rankingData.mock';
export function mockRedisService() {
  const insertRedis = jest.fn(async (keyword: string) => {
    if (keyword === '') throw new BadRequestException({ status: 400, error: 'bad request' });
    for (const data of redisMockData) {
      if (data.keyword === keyword) {
        data[keyword]++;
        redisMockData.sort(compare);
        return 'update';
      }
    }
    redisMockData.push({ keyword: keyword, count: 1 });
    redisMockData.sort(compare);
    return 'new';
  });
  const getTen = jest.fn().mockResolvedValue(redisMockData);
  const redisService = { insertRedis, getTen };
  return redisService;
}

function compare(a: redisRanking, b: redisRanking) {
  if (a.count < b.count) return 1;
  else if (a.count > b.count) return -1;
  return 0;
}
