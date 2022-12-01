import { Injectable, NotFoundException } from '@nestjs/common';
import { CrossRefItem, PaperInfoExtended, PaperInfo, PaperInfoDetail } from './entities/crossRef.entity';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { MgetOperation, SearchHit } from '@elastic/elasticsearch/lib/api/types';

@Injectable()
export class SearchService {
  constructor(private readonly esService: ElasticsearchService) {}

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
    const referenceList =
      item['reference']?.map((reference) => {
        return {
          key: reference['DOI'] || reference.key || reference.unstructured,
          title:
            reference['article-title'] ||
            reference['journal-title'] ||
            reference['series-title'] ||
            reference['volume-title'] ||
            reference.unstructured,
          doi: reference['DOI'],
        };
      }) || [];
    const data = {
      ...this.parsePaperInfoExtended(item),
      referenceList,
    };

    return new PaperInfoDetail(data);
  };

  async getPaper(doi: string) {
    try {
      const paper = await this.esService.get<PaperInfoDetail>({ index: process.env.ELASTIC_INDEX, id: doi });
      return paper;
    } catch (_) {
      return false;
    }
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
        index: process.env.ELASTIC_INDEX,
        from,
        size,
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
    const operations = dataset.flatMap((doc) => [{ index: { _index: process.env.ELASTIC_INDEX, _id: doc.id } }, doc]);
    const bulkResponse = await this.esService.bulk({ refresh: true, operations });
    // console.log(`bulk insert response : ${bulkResponse.items.length}`);
  }
  async multiGet(ids: string[]) {
    if (ids.length === 0) return { docs: [] };
    const docs: MgetOperation[] = ids.map((id) => {
      return {
        _index: process.env.ELASTIC_INDEX,
        _id: id,
        _source: { include: ['key', 'title', 'authors', 'doi', 'publishedAt', 'citations', 'references'] },
      };
    });
    return await this.esService.mget<PaperInfoDetail>({ docs });
  }
}
