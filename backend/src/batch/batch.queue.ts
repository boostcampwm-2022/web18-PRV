import Redis from 'ioredis';

export class RedisQueue {
  constructor(private redis: Redis, public name: string) {}
  async push(value: string, pushLeft = false) {
    if (pushLeft) {
      await this.redis.lpush(this.name, value);
    } else {
      await this.redis.rpush(this.name, value);
    }

    return value;
  }
  async pop(count = 1) {
    return await this.redis.lpop(this.name, count);
  }
  async size() {
    return await this.redis.llen(this.name);
  }
}
