import { Controller, Get, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { SearchService } from './search.service';
import { AutoCompleteDto, GetPaperDto, SearchDto } from './entities/search.dto';
import { SearchTotalHits } from '@elastic/elasticsearch/lib/api/types';
import { CROSSREF_CACHE_QUEUE } from 'src/util';
import { Interval } from '@nestjs/schedule';
import { RankingService } from 'src/ranking/ranking.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService, private readonly rankingService: RankingService) {}
  @Get('auto-complete')
  async getAutoCompletePapers(@Query() query: AutoCompleteDto) {
    const { keyword } = query;
    const elastic = await this.searchService.getElasticSearch(keyword);
    const elasticDataCount = (elastic.hits.total as SearchTotalHits).value;
    if (elasticDataCount > 0) {
      return elastic.hits.hits.map((paper) => paper._source);
    }
    const { items } = await this.searchService.getCrossRefAutoCompleteData(keyword);
    const papers = this.searchService.parseCrossRefData(items, this.searchService.parsePaperInfo);
    return papers;
  }

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async getPapers(@Query() query: SearchDto) {
    const { keyword, rows, page } = query;
    const { items, totalItems } = await this.searchService.getCrossRefData(keyword, rows, page);
    const papers = this.searchService.parseCrossRefData(items, this.searchService.parsePaperInfoExtended);
    this.rankingService.insertRedis(keyword);
    //검색한 이후에 캐싱 진행으로 변경
    this.searchService.crawlAllCrossRefData(keyword, '*');
    return {
      papers,
      pageInfo: {
        totalItems,
        totalPages: Math.ceil(totalItems / rows),
      },
    };
  }
  @Interval('notifications', 1000)
  async handleInterval() {
    //n 개를 한번에 확인해서 n번을 call 하는 방식 or 바로바로 실행해보고 items개수를 확인 해보는 방식
    // console.log(new Array(...CROSSREF_CACHE_QUEUE.data));
    if (CROSSREF_CACHE_QUEUE.isEmpty()) return;
    else {
      const [url, count] = CROSSREF_CACHE_QUEUE.pop();
      console.log('큐에 담긴 목록 : ', new Array(...CROSSREF_CACHE_QUEUE.data).length);
      const cursor = await this.searchService.getCacheFromCrossRef(url);
    }
  }
  @Get('paper')
  @UsePipes(new ValidationPipe())
  async getPaper(@Query() query: GetPaperDto) {
    const { doi } = query;
    return await this.searchService.getPaper(doi);
  }
}
