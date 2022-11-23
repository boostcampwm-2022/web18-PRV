import { Controller, Get, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { SearchService } from './search.service';
import { PositiveIntegerValidationPipe, SearchValidationPipe } from './pipe/search.pipe';
import { SearchDto } from './pipe/search.dto';
import { SearchTotalHits } from '@elastic/elasticsearch/lib/api/types';
import { BatchService } from './batch.service';
import { CROSSREF_CACHE_QUEUE } from 'src/util';
import { Interval } from '@nestjs/schedule';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService, private readonly batchService: BatchService) {}
  @Get('auto-complete')
  async getAutoCompletePapers(@Query('keyword', SearchValidationPipe) keyword: string) {
    // return await this.searchService.crawlAllCrossRefData(keyword, 100000, 1000);
    // this.batchService.pushKeyword(keyword);

    const elastic = await this.searchService.getElasticSearch(keyword);
    const elasticDataCount = (elastic.hits.total as SearchTotalHits).value;
    if (elasticDataCount > 0) {
      return elastic.hits.hits.map((paper) => paper._source);
    }
    const { items } = await this.searchService.getCrossRefAutoCompleteData(keyword);
    const papers = this.searchService.parseCrossRefData(items);
    // papers.map((paper) => {
    //   this.searchService.putElasticSearch(paper);
    // });
    // crossref에 있는거 다 갖고오기.
    this.searchService.crawlAllCrossRefData(keyword, 100000, 1000);
    // this.searchService.crawlAllCrossRefData(keyword, totalItems, 1000);
    return papers;
  }

  @Get()
  @UsePipes(ValidationPipe)
  async getPapers(@Query() query: SearchDto) {
    const { keyword, rows, page, hasDoi } = query;
    const { items, totalItems } = await this.searchService.getCrossRefData(keyword, rows, page, hasDoi);
    const papers = this.searchService.parseCrossRefData(items);
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
    console.log(CROSSREF_CACHE_QUEUE);
    if (CROSSREF_CACHE_QUEUE.length == 0) return;
    else {
      const url = CROSSREF_CACHE_QUEUE.pop();
      this.searchService.getCacheFromCrossRef(url);
    }
  }
}
