import { Controller, Get, Param } from '@nestjs/common';
import { PopularService } from './popular.service';

@Controller('popular')
export class PopularController {
	constructor(private readonly popularService: PopularService) {}
	@Get()
	async getAll() {
		return this.popularService.getAll();
	}
	@Get(':keyword')
	async insertCache(@Param('keyword') searchStr: string) {
		this.popularService.insertRedis(searchStr);
	}
}
