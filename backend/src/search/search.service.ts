import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { CrossRefResponse, CrossRefItem, PaperInfo } from './entities/crossRef.entity';
import { CROSSREF_API_URL } from '../util';

@Injectable()
export class SearchService {
  constructor(private readonly httpService: HttpService) {}
  async getCrossRefAutoCompleteData(keyword: string) {
    const crossRefData = await this.httpService.axiosRef.get<CrossRefResponse>(CROSSREF_API_URL(keyword));
    const items = crossRefData.data.message.items;
    return items;
  }

  async getCrossRefData(keyword: string, page: number, isDoiExist: boolean) {
    const crossRefData = await this.httpService.axiosRef.get<CrossRefResponse>(
      CROSSREF_API_URL(
        keyword,
        10,
        ['title', 'author', 'created', 'is-referenced-by-count', 'references-count', 'DOI'],
        page,
      ),
    );
    const items = crossRefData.data.message.items;
    return items;
  }

  parseCrossRefData(items: CrossRefItem[]) {
    return items
      .map((item) => {
        const paperInfo: PaperInfo = {};
        paperInfo.title = item.title?.[0];
        paperInfo.authors = item.author?.reduce((acc, cur) => {
          const authorName = `${cur.given ? cur.given + ' ' : ''}${cur.family || ''}`;
          authorName && acc.push(authorName);
          return acc;
        }, []);
        paperInfo.doi = item.DOI;
        paperInfo.publishedAt = item.created?.['date-time'];
        paperInfo.citations = item['is-referenced-by-count'];
        paperInfo.references = item['references-count'];
        return paperInfo;
      })
      .filter((info) => info.title || info.authors?.length > 0);
  }
}
