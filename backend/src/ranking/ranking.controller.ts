import { Controller, Get, Query } from '@nestjs/common';
import { RankingService } from './ranking.service';
import { ApiResponse, ApiRequestTimeoutResponse } from '@nestjs/swagger';
import { Ranking } from './entities/ranking.entity';

@Controller('keyword-ranking')
export class RankingController {
  constructor(private readonly rankingService: RankingService) {}
  @Get()
  @ApiResponse({ status: 200, description: '검색 결과', type: Ranking, isArray: true })
  @ApiRequestTimeoutResponse({ description: '검색 timeout' })
  async getTen() {
    return await this.rankingService.getTen();
  }
  // TODO: search 됐을 때, this.popularService.insertRedis(searchStr);
  @Get('/insert')
  async insertCache(@Query('keyword') searchStr: string) {
    return this.rankingService.insertRedis(searchStr);
  }
}
