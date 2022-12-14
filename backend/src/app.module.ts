import { Module } from '@nestjs/common';
import { RankingModule } from './ranking/ranking.module';
import { SearchModule } from './search/search.module';

@Module({
  imports: [RankingModule, SearchModule],
})
export class AppModule {}
