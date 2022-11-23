import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { HttpModule } from '@nestjs/axios';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { HttpConnection } from '@elastic/elasticsearch';
import { ScheduleModule } from '@nestjs/schedule';
@Module({
  imports: [
    HttpModule,
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
  ],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
