import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { CrossRefResponse, CrossRefItem, PaperInfo } from './entities/crossRef.entity';
import { CROSSREF_API_URL } from '../util';

@Injectable()
export class SearchService {
  constructor(private readonly httpService: HttpService) {}
  async getCrossRefData(keyword: string) {
    const crossRefdata = await this.httpService.axiosRef.get<CrossRefResponse>(CROSSREF_API_URL(keyword));
    const items = crossRefdata.data.message.items;
    return items;
  }
  parseCrossRefData(items: CrossRefItem[]) {
    const result: PaperInfo[] = [];
    items.map((item) => {
      const paperInfo: PaperInfo = {};
      paperInfo.title = item.title?.[0];
      paperInfo.authors = item.author?.reduce((acc, cur) => {
        const authorName = `${cur.given ? cur.given + ' ' : ''}${cur.family || ''}`;
        acc.push(authorName);
        return acc;
      }, []);
      paperInfo.doi = item.DOI;
      result.push(paperInfo);
    });
    return result;
  }
}
