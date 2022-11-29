import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RankingModule } from './ranking/ranking.module';
import { SearchModule } from './search/search.module';

@Module({
  imports: [RankingModule, SearchModule, MongooseModule.forRoot(process.env.MONGODB_URL)],
})
export class AppModule {}
