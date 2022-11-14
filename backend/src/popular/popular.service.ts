import { Injectable } from '@nestjs/common';
import { Popular } from './entities/popular.entity';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
@Injectable()
export class PopularService {
	constructor(@InjectRedis() private readonly redis: Redis) {}
	private populars: Popular[] = [];
	async getAll() {
		this.populars = [];
		const topTen = await this.redis.zrevrangebyscore('Top10', '+inf', 1);
		await Promise.all(
			topTen.map(async (v) => {
				const score = await this.redis.zscore('Top10', v);
				const tmp: Popular = { keyword: v, count: Number(score) };
				this.populars.push(tmp);
			}),
		);
		return this.populars;
	}
	async insertRedis(data: string) {
		const isRanking: string = await this.redis.zscore('Top10', data);
		isRanking ? await this.redis.zadd('Top10', Number(isRanking) + 1, data) : await this.redis.zadd('Top10', 1, data);
	}
}
