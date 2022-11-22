import { Controller, Get, Param, Query } from '@nestjs/common';
import { RankingService } from './ranking.service';

@Controller('keyword-ranking')
export class RankingController {
  constructor(private readonly rankingService: RankingService) {}
  @Get()
  async getTen() {
    return this.rankingService.getTen();
  }
  // TODO: search 됐을 때, this.popularService.insertRedis(searchStr);
  @Get('/insert')
  async insertCache(@Query('keyword') searchStr: string) {
    this.rankingService.insertRedis(searchStr);
  }
}
