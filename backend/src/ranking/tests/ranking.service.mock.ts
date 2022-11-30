export function mockRedisService() {
  const insertRedis = jest.fn(() => {
    return 1;
  });
  const getTen = jest.fn().mockResolvedValue(() => {
    return 30;
  });
  const redisService = { insertRedis, getTen };
  return redisService;
}
