import { Controller, Get, NotFoundException, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { SearchService } from './search.service';
import { AutoCompleteDto, GetPaperDto, SearchDto } from './entities/search.dto';
import { GetGetResult, SearchTotalHits } from '@elastic/elasticsearch/lib/api/types';
import { RankingService } from 'src/ranking/ranking.service';
import { BatchService } from 'src/batch/batch.service';
import { ApiResponse, ApiRequestTimeoutResponse, ApiBadRequestResponse, ApiNotFoundResponse } from '@nestjs/swagger';
import { PaperInfo, PaperInfoDetail, PaperInfoExtended } from './entities/crossRef.entity';

@Controller('search')
export class SearchController {
  constructor(
    private readonly searchService: SearchService,
    private readonly rankingService: RankingService,
    private readonly batchService: BatchService,
  ) {}

  @ApiResponse({ status: 200, description: '자동검색 성공', type: PaperInfo, isArray: true })
  @ApiRequestTimeoutResponse({ description: '검색 timeout' })
  @ApiBadRequestResponse({ description: '유효하지 않은 키워드' })
  @ApiNotFoundResponse({ description: '검색 결과가 존재하지 않습니다. 정보를 수집중입니다.' })
  @Get('auto-complete')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getAutoCompletePapers(@Query() query: AutoCompleteDto) {
    const { keyword } = query;
    const data = await this.searchService.getElasticSearch(keyword);
    const papers = data.hits.hits.map((paper) => new PaperInfo(paper._source));
    return papers;
  }

  @ApiResponse({ status: 200, description: '검색 결과', type: PaperInfoExtended, isArray: true })
  @ApiRequestTimeoutResponse({ description: '검색 timeout' })
  @ApiBadRequestResponse({ description: '유효하지 않은 keyword | rows | page' })
  @ApiNotFoundResponse({ description: '검색 결과가 존재하지 않습니다. 정보를 수집중입니다.' })
  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async getPapers(@Query() query: SearchDto) {
    const { keyword, rows, page } = query;
    const data = await this.searchService.getElasticSearch(keyword, rows, rows * (page - 1));
    const totalItems = (data.hits.total as SearchTotalHits).value;
    const totalPages = Math.ceil(totalItems / rows);
    if (page > totalPages && totalPages !== 0) {
      throw new NotFoundException(`page(${page})는 ${totalPages} 보다 클 수 없습니다.`);
    }
    this.rankingService.insertRedis(keyword);
    const keywordHasSet = await this.batchService.setKeyword(keyword);
    if (keywordHasSet) this.batchService.searchBatcher.pushToQueue(0, 0, -1, true, keyword);

    const papers = data.hits.hits.map((paper) => new PaperInfoExtended(paper._source));
    return {
      papers,
      pageInfo: {
        totalItems,
        totalPages,
      },
    };
  }

  @ApiResponse({ status: 200, description: '논문 상세정보 검색 결과', type: PaperInfoDetail })
  @ApiRequestTimeoutResponse({ description: '검색 timeout' })
  @ApiBadRequestResponse({ description: '유효하지 않은 doi' })
  @ApiNotFoundResponse({ description: '해당 doi는 존재하지 않습니다. 정보를 수집중입니다.' })
  @Get('paper')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getPaper(@Query() query: GetPaperDto) {
    const { doi } = query;

    const keywordHasSet = await this.batchService.setKeyword(doi);
    if (keywordHasSet) this.batchService.doiBatcher.pushToQueue(0, 0, -1, false, doi);

    const paper = await this.searchService.getPaper(doi);
    if (paper) {
      const origin = new PaperInfoDetail(paper._source);
      // 기존에 넣어놨던 데이터에 referenceList라는 key가 없을 수 있다..
      if (!origin.referenceList?.length) {
        this.batchService.doiBatcher.pushToQueue(0, 1, -1, false, origin.doi || origin.key);
        return { ...origin, referenceList: [] };
      }

      // Is it N+1 Problem?
      const references = await this.searchService.multiGet(origin.referenceList.map((ref) => ref.key).filter(Boolean));
      const referenceList = references.docs.map((doc) => {
        const _source = (doc as GetGetResult<PaperInfoDetail>)._source;
        return { key: doc._id, ..._source };
      });
      return { ...origin, referenceList };
    }
    throw new NotFoundException('해당 doi는 존재하지 않습니다. 정보를 수집중입니다.');
  }

  @Get('stat')
  async getStats() {
    const es = await this.searchService.esStat();
    const searchBatch = await this.batchService.searchBatcher.queue.size();
    const doiBatch = await this.batchService.doiBatcher.queue.size();
    return {
      es,
      searchBatch,
      doiBatch,
    };
  }
}
