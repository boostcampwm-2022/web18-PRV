import { Controller, Get, Query, RequestTimeoutException, UsePipes, ValidationPipe } from '@nestjs/common';
import { SearchService } from './search.service';
import { KeywordValidationPipe } from './pipe/search.pipe';
import { SearchDto } from './pipe/search.dto';
import { SearchTotalHits } from '@elastic/elasticsearch/lib/api/types';
import { BatchService } from './batch.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService, private readonly batchService: BatchService) {}
  @Get('auto-complete')
  async getAutoCompletePapers(@Query('keyword', KeywordValidationPipe) keyword: string) {
    this.batchService.pushKeyword(keyword);

    const elastic = await this.searchService.getElasticSearch(keyword);
    console.log(elastic.hits.hits);
    const elasticDataCount = (elastic.hits.total as SearchTotalHits).value;
    if (elasticDataCount > 0) {
      return elastic.hits.hits.map((paper) => paper._source);
    }

    const { items } = await this.searchService.getCrossRefAutoCompleteData(keyword).catch((err) => {
      throw new RequestTimeoutException(err.message);
    });
    const papers = this.searchService.parseCrossRefData(items);
    papers.map((paper) => {
      this.searchService.putElasticSearch(paper);
    });
    // crossref에 있는거 다 갖고오기.
    // this.searchService.crawlAllCrossRefData(keyword, totalItems, 1000);
    return papers;
  }

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async getPapers(@Query('keyword', KeywordValidationPipe) keyword: string, @Query() query: SearchDto) {
    const { rows, page } = query;
    const { items, totalItems } = await this.searchService.getCrossRefData(keyword, rows, page).catch((err) => {
      throw new RequestTimeoutException(err.message);
    });
    const papers = this.searchService.parseCrossRefData(items);
    return {
      papers,
      pageInfo: {
        totalItems,
        totalPages: Math.ceil(totalItems / rows),
      },
    };
  }
  @Get('getAll')
  async getAllElastic() {
    return await this.searchService.getAllElasticData();
  }
}
