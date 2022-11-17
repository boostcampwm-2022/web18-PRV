import { Controller, Get, Param, Query } from '@nestjs/common';
import { RankingService } from './ranking.service';

@Controller('keyword-ranking')
export class RankingController {
  constructor(private readonly rankingService: RankingService) {}
  @Get()
  async getAll() {
    return this.rankingService.getAll();
  }
  // TODO: search 됐을 때, this.popularService.insertRedis(searchStr);
  @Get(':keyword')
  async insertCache(@Param('keyword') searchStr: string) {
    this.rankingService.insertRedis(searchStr);
  }
}
