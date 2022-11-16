import { Controller, Get, Query } from '@nestjs/common';
import { Keyword } from './entities/keyword.entity';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
	constructor(private readonly searchService: SearchService) {}
	@Get()
	getAll() {
		console.log('search');
	}
	@Get('autoCompleted')
	async getTitleAndAuthor(@Query() searchKeyword: Keyword) {
		const items = await this.searchService.getCrossRefData(searchKeyword.keyword);
		return this.searchService.parseCrossRefData(items);
	}
}
