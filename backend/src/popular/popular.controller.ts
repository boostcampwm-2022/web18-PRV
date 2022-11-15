import { Controller, Get, Param } from '@nestjs/common';
import { PopularService } from './popular.service';

@Controller()
export class PopularController {
	constructor(private readonly popularService: PopularService) {}
	@Get('/popular')
	async getAll() {
		return this.popularService.getAll();
	}
	// TODO: search 됐을 때, this.popularService.insertRedis(searchStr);
	@Get('/popular:keyword')
	async insertCache(@Param('keyword') searchStr: string) {
		this.popularService.insertRedis(searchStr);
	}
}
