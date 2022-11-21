import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchValidationPipe } from './pipe/search.pipe';

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
  async getPapers(@Query('keyword', SearchValidationPipe) keyword: string, page: number, isDoiExist?: boolean) {
    const items = await this.searchService.getCrossRefData(keyword, page, isDoiExist);
    const papers = this.searchService.parseCrossRefData(items);
    return papers;
  }
}
