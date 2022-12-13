import { Controller, Get, Query } from '@nestjs/common';
import { RankingService } from './ranking.service';
import { ApiResponse, ApiRequestTimeoutResponse } from '@nestjs/swagger';
import { Ranking } from './entities/ranking.entity';

@Controller('keyword-ranking')
export class RankingController {
  constructor(private readonly rankingService: RankingService) {}
  @ApiResponse({ status: 200, description: '검색 결과', type: Ranking, isArray: true })
  @ApiRequestTimeoutResponse({ description: '검색 timeout' })
  @Get()
  async getTen() {
    return await this.rankingService.getTen();
  }
}
