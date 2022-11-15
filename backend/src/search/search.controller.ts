import { Controller, Get, Query } from '@nestjs/common';
import { autoComplete } from './entities/autoComplete.entity';
import { CrossRef } from './entities/crossRef.entity';
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
		const crossRefData = await Promise.all([
			this.searchService.getTitleFromRef(searchKeyword.keyword),
			this.searchService.getAuthorFromRef(searchKeyword.keyword),
		]);
		const title = crossRefData[0];
		const author = crossRefData[1];
		const titleItems = title.data.message.items;
		const authorItems = author.data.message.items;
		const result: autoComplete = { title: [], author: [] };
		titleItems.map((item) => {
			const tmp: CrossRef = { title: '', author: { given: '', family: '' }, doi: '' };
			tmp.title = item.title[0];
			if (item.author) {
				tmp.author.given = item.author[0].given;
				tmp.author.family = item.author[0].family;
			} else tmp.author = undefined;
			tmp.doi = item.DOI;
			result.title.push(tmp);
		});
		authorItems.map((item) => {
			const tmp: CrossRef = { title: '', author: { given: '', family: '' }, doi: '' };
			tmp.title = item.title[0];
			if (item.author) {
				tmp.author.given = item.author[0].given;
				tmp.author.family = item.author[0].family;
			} else tmp.author = undefined;
			tmp.doi = item.DOI;
			result.author.push(tmp);
		});
		return result;
	}
}
