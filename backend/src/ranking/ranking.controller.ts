import { Controller, Get, Param } from '@nestjs/common';
import { RankingService } from './ranking.service';

@Controller()
export class RankingController {
	constructor(private readonly rankingService: RankingService) {}
	@Get('/keyword-ranking')
	async getAll() {
		return this.rankingService.getAll();
	}
	// TODO: search 됐을 때, this.popularService.insertRedis(searchStr);
	@Get('/keyword-ranking:keyword')
	async insertCache(@Param('keyword') searchStr: string) {
		this.rankingService.insertRedis(searchStr);
	}
}
