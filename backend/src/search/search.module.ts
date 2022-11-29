import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { HttpModule } from '@nestjs/axios';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { HttpConnection } from '@elastic/elasticsearch';
import { ScheduleModule } from '@nestjs/schedule';
import { RankingService } from 'src/ranking/ranking.service';
import { MongooseModule } from '@nestjs/mongoose';
import { RankingSchema, SearchRanking } from 'src/model/mongo.schema';
@Module({
  imports: [
    HttpModule.register({
      timeout: 20000,
      headers: {
        'User-Agent': `Axios/1.1.3(mailto:${process.env.MAIL_TO})`,
      },
    }),
    ElasticsearchModule.registerAsync({
      useFactory: () => ({
        node: process.env.ELASTIC_HOST,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        auth: {
          username: process.env.ELASTIC_USER,
          password: process.env.ELASTIC_PASSWORD,
        },
        Connection: HttpConnection,
      }),
    }),
    ScheduleModule.forRoot(),
    MongooseModule.forFeature([{ name: SearchRanking.name, schema: RankingSchema }]),
  ],
  controllers: [SearchController],
  providers: [SearchService, RankingService],
})
export class SearchModule {}
