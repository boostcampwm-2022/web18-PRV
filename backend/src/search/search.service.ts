import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
@Injectable()
export class SearchService {
	constructor(private readonly httpService: HttpService) {}
	async findAll() {
		return this.httpService.axiosRef.get(`https://www.naver.com/`);
	}
}
