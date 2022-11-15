import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
@Injectable()
export class SearchService {
	constructor(private readonly httpService: HttpService) {}
	getAuthorFromRef(keyword: string) {
		return this.httpService.axiosRef.get(
			`https://api.crossref.org/works?query.author=${keyword}&rows=5&select=author,title,DOI`,
		);
	}
	getTitleFromRef(keyword: string) {
		return this.httpService.axiosRef.get(
			`https://api.crossref.org/works?query.title=${keyword}&rows=5&select=title,author,DOI`,
		);
	}
}
