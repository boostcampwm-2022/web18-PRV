import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchValidationPipe } from './pipe/search.pipe';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}
  @Get('auto-complete')
  async getAutoCompletePapers(@Query('keyword', SearchValidationPipe) keyword: string) {
    const items = await this.searchService.getCrossRefData(keyword);
    return this.searchService.parseCrossRefData(items);
  }
}
