import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { PositiveIntegerValidationPipe, SearchValidationPipe } from './pipe/search.pipe';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}
  @Get('auto-complete')
  async getAutoCompletePapers(@Query('keyword', SearchValidationPipe) keyword: string) {
    const items = await this.searchService.getCrossRefAutoCompleteData(keyword);
    const papers = this.searchService.parseCrossRefData(items);
    return papers;
  }

  @Get()
  async getPapers(
    @Query('keyword', SearchValidationPipe) keyword: string,
    @Query('rows', PositiveIntegerValidationPipe) rows = 20,
    @Query('page', PositiveIntegerValidationPipe) page = 1,
    @Query('hasDoi') hasDoi = true,
  ) {
    const { items, totalItems } = await this.searchService.getCrossRefData(keyword, rows, page, hasDoi);
    const papers = this.searchService.parseCrossRefData(items);
    return {
      papers,
      pageInfo: {
        totalItems,
        totalPages: Math.ceil(totalItems / rows),
      },
    };
  }
}
