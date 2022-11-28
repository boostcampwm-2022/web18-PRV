import { Controller, Get, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { SearchService } from './search.service';
import { AutoCompleteDto, GetPaperDto, SearchDto } from './entities/search.dto';
import { SearchTotalHits } from '@elastic/elasticsearch/lib/api/types';
import { CROSSREF_CACHE_QUEUE } from 'src/util';
import { Interval } from '@nestjs/schedule';
import { RankingService } from 'src/ranking/ranking.service';
import { ApiResponse, ApiRequestTimeoutResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import { PaperInfo, PaperInfoDetail, PaperInfoExtended } from './entities/crossRef.entity';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService, private readonly rankingService: RankingService) {}

  @ApiResponse({ status: 200, description: '자동검색 성공', type: PaperInfo, isArray: true })
  @ApiRequestTimeoutResponse({ description: '검색 timeout' })
  @ApiBadRequestResponse({ status: 400, description: '유효하지 않은 키워드' })
  @Get('auto-complete')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getAutoCompletePapers(@Query() query: AutoCompleteDto) {
    const { keyword } = query;
    const elastic = await this.searchService.getElasticSearch(keyword);
    const elasticDataCount = (elastic.hits.total as SearchTotalHits).value;
    if (elasticDataCount > 0) {
      return elastic.hits.hits.map((paper) => paper._source);
    }
    const { items, totalItems } = await this.searchService.getCrossRefAutoCompleteData(keyword);
    const papers = this.searchService.parseCrossRefData(items, this.searchService.parsePaperInfo);
    this.searchService.crawlAllCrossRefData(keyword, totalItems, 1000);
    return papers;
  }

  @ApiResponse({ status: 200, description: '검색 결과', type: PaperInfoExtended, isArray: true })
  @ApiRequestTimeoutResponse({ description: '검색 timeout' })
  @ApiBadRequestResponse({ status: 400, description: '유효하지 않은 keyword | rows | page' })
  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async getPapers(@Query() query: SearchDto) {
    const { keyword, rows, page } = query;
    const { items, totalItems } = await this.searchService.getCrossRefData(keyword, rows, page);
    const papers = this.searchService.parseCrossRefData(items, this.searchService.parsePaperInfoExtended);
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

  @ApiResponse({ status: 200, description: '논문 상세정보 검색 결과', type: PaperInfoDetail })
  @ApiRequestTimeoutResponse({ description: '검색 timeout' })
  @ApiBadRequestResponse({ description: '유효하지 않은 doi' })
  @Get('paper')
  @UsePipes(new ValidationPipe())
  async getPaper(@Query() query: GetPaperDto) {
    const { doi } = query;
    return await this.searchService.getPaper(doi);
  }
}
