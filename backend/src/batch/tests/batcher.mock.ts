import Redis from 'ioredis';

export function mockRedisQueue(popItem: () => string) {
  const lpush = jest.fn().mockResolvedValue(true);
  const rpush = jest.fn().mockResolvedValue(true);
  const lpop = jest
    .fn()
    .mockImplementation((key: string, size: number) => Array.from({ length: size }, () => popItem()));
  const llen = jest.fn().mockResolvedValue(10);
  return {
    lpush,
    rpush,
    lpop,
    llen,
  } as unknown as Redis;
}

export const popDoiItem = () => `0:0:-1:https://api.crossref.org/works/10.1234/asdf`;
export const popSearchItem = () => `0:0:-1:https://api.crossref.org/works?query=keyword&rows=1000&cursor=examplecursor`;
