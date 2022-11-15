import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';
@Controller('search')
export class SearchController {
	constructor(private readonly searchService: SearchService) {}
	@Get()
	getAll() {
		console.log('search');
	}
	@Get('autoCompleted')
	async getTitleAndAuthor(@Query() searchKeyword: string) {
		const result = await this.searchService.findAll();
		console.log(result);
	}
}
