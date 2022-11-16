import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { autoComplete } from './entities/autoComplete.entity';
import { CrossRef } from './entities/crossRef.entity';

interface CrossRefResponse {
	message: {
		items: CrossRefItem[];
	};
}
type CrossRefItem = CrossRef & { DOI?: string };

@Injectable()
export class SearchService {
	constructor(private readonly httpService: HttpService) {}
	async getCrossRefData(keyword: string) {
		const crossRefdata = await this.httpService.axiosRef.get<CrossRefResponse>(
			`https://api.crossref.org/works?query=${keyword}&rows=5&select=author,title,DOI`,
		);
		const items = crossRefdata.data.message.items;
		return items;
	}
	parseCrossRefData(items: CrossRefItem[]) {
		const result: autoComplete = { autocomplete: [] };
		items.map((item) => {
			const tmp: CrossRef = {};
			tmp.title = item.title[0];
			if (item.author) {
				tmp.author = {
					given: item.author[0].given,
					family: item.author[0].family,
				};
			}
			tmp.doi = item.DOI;
			result.autocomplete.push(tmp);
		});
		return result;
	}
}
