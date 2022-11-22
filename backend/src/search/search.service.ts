import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { CrossRefResponse, CrossRefItem, PaperInfoExtended } from './entities/crossRef.entity';
import { CROSSREF_API_URL } from '../util';

@Injectable()
export class SearchService {
  constructor(private readonly httpService: HttpService) {}
  async getCrossRefAutoCompleteData(keyword: string) {
    const crossRefdata = await this.httpService.axiosRef.get<CrossRefResponse>(CROSSREF_API_URL(keyword));
    const items = crossRefdata.data.message.items;
    return items;
  }

  async getCrossRefData(keyword: string, rows: number, page: number, isDoiExist: boolean) {
    const crossRefdata = await this.httpService.axiosRef.get<CrossRefResponse>(
      CROSSREF_API_URL(
        keyword,
        rows,
        ['title', 'author', 'created', 'is-referenced-by-count', 'references-count', 'DOI'],
        page,
      ),
    );
    const items = crossRefdata.data.message.items;
    const totalItems = crossRefdata.data.message['total-results'];
    return { items, totalItems };
  }

  parseCrossRefData(items: CrossRefItem[]) {
    return items
      .map((item) => {
        const paperInfo = new PaperInfoExtended();
        paperInfo.title = item.title?.[0];
        paperInfo.authors = item.author?.reduce((acc, cur) => {
          const authorName = `${cur.name ? cur.name : cur.given ? cur.given + ' ' : ''}${cur.family || ''}`;
          authorName && acc.push(authorName);
          return acc;
        }, []);
        paperInfo.doi = item.DOI;
        paperInfo.publishedAt = item.created?.['date-time'];
        paperInfo.citations = item['is-referenced-by-count'];
        paperInfo.references = item['reference-count'];
        return paperInfo;
      })
      .filter((info) => info.title || info.authors?.length > 0);
  }
}
