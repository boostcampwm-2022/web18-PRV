import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { CrossRefResponse, CrossRefItem, PaperInfoExtended, PaperInfo } from './entities/crossRef.entity';
import { CROSSREF_API_URL } from '../util';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { SearchHit } from '@elastic/elasticsearch/lib/api/types';

@Injectable()
export class SearchService {
  constructor(private readonly httpService: HttpService, private readonly esService: ElasticsearchService) {}
  async getCrossRefAutoCompleteData(keyword: string) {
    const crossRefdata = await this.httpService.axiosRef.get<CrossRefResponse>(CROSSREF_API_URL(keyword));
    const items = crossRefdata.data.message.items;
    const totalItems = crossRefdata.data.message['total-results'];
    return { items, totalItems };
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

  async crawlAllCrossRefData(keyword: string, totalItems: number, rows: number) {
    const pages = await Promise.allSettled(
      Array(Math.ceil(totalItems / rows))
        .fill(0)
        .map((_, i) => {
          return this.getCrossRefData(keyword, rows, i + 1, false);
        }),
    );
    console.log(totalItems);
    console.log(pages.length);
    pages.forEach((page) => {
      if (page.status === 'fulfilled') {
        const papers = this.parseCrossRefData(page.value.items);
        papers.forEach((paper) => {
          this.putElasticSearch(paper);
        });
      } else {
        console.log(page.reason);
      }
    });
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
  async putElasticSearch(paper: PaperInfoExtended) {
    return await this.esService.index({
      index: process.env.ELASTIC_INDEX,
      id: paper.doi,
      document: {
        ...paper,
      },
    });
  }
  async getElasticSearch(keyword: string, size = 5) {
    const query = {
      bool: {
        should: [
          {
            match_bool_prefix: {
              title: {
                query: keyword,
              },
            },
          },
          {
            match_bool_prefix: {
              author: {
                query: keyword,
              },
            },
          },
        ],
      },
    };
    return await this.esService
      .search<PaperInfo>({
        index: process.env.ELASTIC_INDEX,
        size,
        query,
      })
      .catch(() => {
        return { hits: { hits: [] as SearchHit<PaperInfo>[], total: 0 } };
      });
  }
  async getAllElasticData() {
    return await this.esService.search({ index: process.env.ELASTIC_INDEX });
  }
  //match: title , author (상위5개의 fuzzi점수를 비교해서 큰쪽을 가져가는걸로)
}
//title, author
