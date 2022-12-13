import { Injectable } from '@nestjs/common';
import {
  CrossRefItem,
  PaperInfoExtended,
  PaperInfo,
  PaperInfoDetail,
  CrossRefPaperResponse,
} from './entities/crossRef.entity';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { MgetOperation, SearchHit } from '@elastic/elasticsearch/lib/api/types';
import { HttpService } from '@nestjs/axios';
import { CROSSREF_API_PAPER_URL } from '../util';
import { ELASTIC_INDEX } from 'src/envLayer';

@Injectable()
export class SearchService {
  constructor(private readonly esService: ElasticsearchService, private readonly httpService: HttpService) {}

  parsePaperInfo = (item: CrossRefItem) => {
    const data = {
      title: item.title?.[0],
      authors: item.author?.reduce((acc, cur) => {
        const authorName = `${cur.name ? cur.name : cur.given ? cur.given + ' ' : ''}${cur.family || ''}`;
        authorName && acc.push(authorName);
        return acc;
      }, []),
      doi: item.DOI,
      key: item.DOI,
    };

    return new PaperInfo(data);
  };
  parsePaperInfoExtended = (item: CrossRefItem) => {
    const data = {
      ...this.parsePaperInfo(item),
      publishedAt: item.created?.['date-time'],
      citations: item['is-referenced-by-count'],
      references: item['references-count'],
    };

    return new PaperInfoExtended(data);
  };
  parsePaperInfoDetail = (item: CrossRefItem) => {
    const keysTable: { [key: string]: boolean } = {};
    const referenceList =
      item['reference']
        ?.map((reference) => {
          const key = reference['DOI'] || reference.key || reference.unstructured;
          const title =
            reference['article-title'] ||
            reference['journal-title'] ||
            reference['series-title'] ||
            reference['volume-title'] ||
            reference.unstructured;
          const doi = reference['DOI'];
          const authors = reference['author'] ? [reference['author']] : undefined;
          return {
            key,
            title,
            doi,
            authors,
          };
        })
        .filter((reference) => {
          if (!keysTable[reference.key]) {
            keysTable[reference.key] = true;
            return true;
          }
          return false;
        }) || [];
    const data = {
      ...this.parsePaperInfoExtended(item),
      referenceList,
    };

    return new PaperInfoDetail(data);
  };
  async getPaperFromCrossref(doi: string) {
    const item = await this.httpService.axiosRef.get<CrossRefPaperResponse>(CROSSREF_API_PAPER_URL(doi));
    return this.parsePaperInfoDetail(item.data.message);
  }
  async getPaper(doi: string) {
    try {
      const paper = await this.esService.get<PaperInfoDetail>({ index: ELASTIC_INDEX, id: doi });
      return paper;
    } catch (_) {
      return false;
    }
  }
  async putElasticSearch(paper: PaperInfoExtended) {
    return await this.esService.index({
      index: ELASTIC_INDEX,
      id: paper.doi,
      document: {
        ...paper,
      },
    });
  }
  async getElasticSearch(keyword: string, size = 5, from = 0) {
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
      .search<PaperInfoDetail>({
        index: ELASTIC_INDEX,
        from,
        size,
        sort: ['_score', { citations: 'desc' }],
        query,
      })
      .catch(() => {
        return { hits: { hits: [] as SearchHit<PaperInfoDetail>[], total: 0 } };
      });
  }

  async bulkInsert(papers: PaperInfoDetail[]) {
    const dataset = papers.map((paper) => {
      return { id: paper.doi, ...paper };
    });
    if (dataset.length <= 0) return;
    const operations = dataset.flatMap((doc) => [{ index: { _index: ELASTIC_INDEX, _id: doc.id } }, doc]);
    const bulkResponse = await this.esService.bulk({ refresh: true, operations });
    // console.log(`bulk insert response : ${bulkResponse.items.length}`);
  }
  async multiGet(ids: string[]) {
    if (ids.length === 0) return { docs: [] };
    const docs: MgetOperation[] = ids.map((id) => {
      return {
        _index: ELASTIC_INDEX,
        _id: id,
        _source: { include: ['key', 'title', 'authors', 'doi', 'publishedAt', 'citations', 'references'] },
      };
    });
    return await this.esService.mget<PaperInfoDetail>({ docs });
  }
  esStat() {
    return this.esService.cat.indices();
  }
}
