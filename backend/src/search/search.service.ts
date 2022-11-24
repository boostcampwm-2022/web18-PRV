import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { CrossRefResponse, CrossRefItem, PaperInfoExtended, PaperInfo } from './entities/crossRef.entity';
import { CROSSREF_API_URL, CROSSREF_CACHE_QUEUE } from '../util';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { SearchHit } from '@elastic/elasticsearch/lib/api/types';

@Injectable()
export class SearchService {
  constructor(private readonly httpService: HttpService, private readonly esService: ElasticsearchService) {}
  async getCrossRefData(keyword: string, rows: number, page: number, selects?: string[]) {
    const crossRefdata = await this.httpService.axiosRef
      .get<CrossRefResponse>(CROSSREF_API_URL(keyword, rows, page, selects))
      .catch((err) => {
        throw new RequestTimeoutException(err.message);
      });
    const items = crossRefdata.data.message.items;
    const totalItems = crossRefdata.data.message['total-results'];
    return { items, totalItems };
  }
  async crawlAllCrossRefData(keyword: string, totalItems: number, rows: number) {
    if (totalItems >= 10000) totalItems = 10000;
    await Promise.all(
      Array(Math.ceil(totalItems / rows))
        .fill(0)
        .map((v, i) => {
          CROSSREF_CACHE_QUEUE.push(
            CROSSREF_API_URL(keyword, rows, i + 1, [
              'title',
              'author',
              'created',
              'is-referenced-by-count',
              'references-count',
              'DOI',
            ]),
          );
        }),
    );
  }
  parseCrossRefData<T extends PaperInfo>(items: CrossRefItem[]) {
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
        paperInfo.references = item['references-count'];
        return paperInfo as T;
      })
      .filter((info) => info.title);
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
  async getCacheFromCrossRef(url: string) {
    try {
      const crossRefdata = await this.httpService.axiosRef.get<CrossRefResponse>(url);
      const items = crossRefdata.data.message.items;
      const papers = this.parseCrossRefData(items);
      papers.map((paper) => {
        this.putElasticSearch(paper);
      });
    } catch (error) {}
  }
}
