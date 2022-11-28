import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import {
  CrossRefResponse,
  CrossRefItem,
  PaperInfoExtended,
  PaperInfo,
  CrossRefPaperResponse,
  PaperInfoDetail,
} from './entities/crossRef.entity';
import { CROSSREF_API_PAPER_URL, CROSSREF_API_URL, CROSSREF_CACHE_QUEUE } from '../util';
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
  parseCrossRefData<T extends PaperInfo>(items: CrossRefItem[], parser: (item: CrossRefItem) => T) {
    return items.map(parser).filter((info) => info.title || info.authors?.length > 0);
  }
  parsePaperInfo = (item: CrossRefItem) => {
    const paperInfo = {
      title: item.title?.[0],
      authors: item.author?.reduce((acc, cur) => {
        const authorName = `${cur.name ? cur.name : cur.given ? cur.given + ' ' : ''}${cur.family || ''}`;
        authorName && acc.push(authorName);
        return acc;
      }, []),
      doi: item.DOI,
    } as PaperInfo;

    return paperInfo;
  };
  parsePaperInfoExtended = (item: CrossRefItem) => {
    const paperInfo = {
      ...this.parsePaperInfo(item),
      publishedAt: item.created?.['date-time'],
      citations: item['is-referenced-by-count'],
      references: item['references-count'],
    } as PaperInfoExtended;

    return paperInfo;
  };
  parsePaperInfoDetail = (item: CrossRefItem) => {
    const referenceList =
      item['reference']?.map((reference) => {
        return {
          title:
            reference['article-title'] ||
            reference['journal-title'] ||
            reference['series-title'] ||
            reference['volume-title'],
          doi: reference['DOI'],
          // TODO: 현재 원하는 정보를 얻기 위해서는 해당 reference에 대한 정보를 crossref에 다시 요청해야함
          author: reference['author'],
          publishedAt: reference['year'],
          citations: 0,
          references: 0,
        };
      }) || [];
    const paperInfo = {
      ...this.parsePaperInfoExtended(item),
      referenceList,
    } as PaperInfoDetail;

    return paperInfo;
  };

  async getPaper(doi: string) {
    const item = await this.httpService.axiosRef.get<CrossRefPaperResponse>(CROSSREF_API_PAPER_URL(doi));
    return this.parsePaperInfoDetail(item.data.message);
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
      const papers = this.parseCrossRefData(items, this.parsePaperInfoExtended);
      papers.map((paper) => {
        this.putElasticSearch(paper);
      });
    } catch (error) {}
  }
}
