import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { HttpModule } from '@nestjs/axios';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { HttpConnection } from '@elastic/elasticsearch';
import { ScheduleModule } from '@nestjs/schedule';
import { RankingService } from 'src/ranking/ranking.service';
import { BatchService } from 'src/batch/batch.service';
import { MAIL_TO, ELASTIC_HOST, ELASTIC_USER, ELASTIC_PASSWORD } from 'src/envLayer';
@Module({
  imports: [
    HttpModule.register({
      timeout: 1000 * 60,
      headers: {
        'User-Agent': `Axios/1.1.3(mailto:${MAIL_TO})`,
      },
    }),
    ElasticsearchModule.registerAsync({
      useFactory: () => ({
        node: ELASTIC_HOST,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        auth: {
          username: ELASTIC_USER,
          password: ELASTIC_PASSWORD,
        },
        Connection: HttpConnection,
      }),
    }),
    ScheduleModule.forRoot(),
  ],
  controllers: [SearchController],
  providers: [SearchService, RankingService, BatchService],
})
export class SearchModule {}
