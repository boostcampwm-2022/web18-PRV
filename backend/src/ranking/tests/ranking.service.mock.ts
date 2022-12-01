import { redisRanking } from '../entities/ranking.entity';
import redisMockData from './rankingData.mock';
export function mockRedisService() {
  const insertRedis = jest.fn(async (keyword: string) => {
    // return redisMockData.reduce((acc, select) => {
    //   if (select.keyword === keyword) {
    //     select[keyword]++;
    //     return true;
    //   }
    // }, {});
    for (const data of redisMockData) {
      if (data.keyword === keyword) {
        data[keyword]++;
        return true;
      }
    }
  });
  const getTen = jest.fn().mockResolvedValue(redisMockData.slice(0, 10));
  const redisService = { insertRedis, getTen };
  return redisService;
}
