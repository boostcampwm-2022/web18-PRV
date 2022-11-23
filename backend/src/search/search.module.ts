import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { BatchService } from './batch.service';
import { HttpModule } from '@nestjs/axios';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { HttpConnection } from '@elastic/elasticsearch';
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
  ],
  controllers: [SearchController],
  providers: [SearchService, BatchService],
})
export class SearchModule {}
