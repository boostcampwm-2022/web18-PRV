import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
	constructor(private readonly searchService: SearchService) {}
	@Get()
	getAll() {
		console.log('search');
	}
	@Get('auto-complete')
	async getAutoCompletePapers(@Query('keyword') keyword: string) {
		const items = await this.searchService.getCrossRefData(keyword);
		return this.searchService.parseCrossRefData(items);
	}
}
