import { Injectable } from '@nestjs/common';
import { Popular } from './entities/popular.entity';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
@Injectable()
export class PopularService {
	constructor(@InjectRedis() private readonly redis: Redis) {}
	async getAll() {
		const topTen = await this.redis.zrevrangebyscore('Top10', '+inf', 1);
		const scores = await Promise.all(
			topTen.map((v) => {
				return this.redis.zscore('Top10', v);
			}),
		);
		return scores.map((score, i) => {
			const tmp: Popular = { keyword: topTen[i], count: Number(score) };
			return tmp;
		});
	}
	async insertRedis(data: string) {
		const isRanking: string = await this.redis.zscore('Top10', data);
		isRanking ? await this.redis.zadd('Top10', Number(isRanking) + 1, data) : await this.redis.zadd('Top10', 1, data);
	}
}
