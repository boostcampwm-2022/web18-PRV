import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { HttpModule } from '@nestjs/axios';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { HttpConnection } from '@elastic/elasticsearch';
@Module({
  imports: [
    HttpModule,
    ElasticsearchModule.registerAsync({
      useFactory: () => ({
        node: `http://localhost:9200`,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        Connection: HttpConnection,
      }),
    }),
  ],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
// -e "xpack.security.enabled=false"
// elasticsearch docker disable ssl
// https://stackoverflow.com/questions/47035056/how-to-disable-security-username-password-on-elasticsearch-docker-container
