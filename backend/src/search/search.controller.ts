import { Controller, Get, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { SearchService } from './search.service';

import { KeywordValidationPipe } from './pipe/search.pipe';
import { SearchDto } from './pipe/search.dto';
import { SearchTotalHits } from '@elastic/elasticsearch/lib/api/types';
import { CROSSREF_CACHE_QUEUE } from 'src/util';
import { Interval } from '@nestjs/schedule';
import { RankingService } from 'src/ranking/ranking.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService, private readonly rankingService: RankingService) {}
  @Get('auto-complete')
  async getAutoCompletePapers(@Query('keyword', KeywordValidationPipe) keyword: string) {
    const elastic = await this.searchService.getElasticSearch(keyword);
    const elasticDataCount = (elastic.hits.total as SearchTotalHits).value;
    if (elasticDataCount > 0) {
      return elastic.hits.hits.map((paper) => paper._source);
    }
    const { items, totalItems } = await this.searchService.getCrossRefAutoCompleteData(keyword);
    const papers = this.searchService.parseCrossRefData(items);
    this.searchService.crawlAllCrossRefData(keyword, totalItems, 1000);
    return papers;
  }

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async getPapers(@Query('keyword', KeywordValidationPipe) keyword: string, @Query() query: SearchDto) {
    const { rows, page } = query;
    const { items, totalItems } = await this.searchService.getCrossRefData(keyword, rows, page);
    const papers = this.searchService.parseCrossRefData(items);
    this.rankingService.insertRedis(keyword);
    return {
      papers,
      pageInfo: {
        totalItems,
        totalPages: Math.ceil(totalItems / rows),
      },
    };
  }
  @Interval('notifications', 1000)
  handleInterval() {
    //ToDo 진짜 queue로 변경해야함 리스트에서 shift를 쓰면 최악의 경우 O(n)발생 우선 pop으로 지정
    if (CROSSREF_CACHE_QUEUE.length == 0) return;
    else {
      const url = CROSSREF_CACHE_QUEUE.pop();
      this.searchService.getCacheFromCrossRef(url);
    }
  }
}
