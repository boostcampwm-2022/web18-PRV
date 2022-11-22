import { SearchController } from '../search.controller';
import { SearchService } from '../search.service';
import { HttpService } from '@nestjs/axios';
import { CrossRefResponse, PaperInfo, PaperInfoExtended } from '../entities/crossRef.entity';
import mockData from './crossref.mock';
import { Test, TestingModule } from '@nestjs/testing';
describe('SearchController', () => {
  let controller: SearchController;

  beforeEach(async () => {
    const httpService = new HttpService();
    jest.spyOn(httpService['axiosRef'], 'get').mockImplementation((url: string) => {
      const params = new URLSearchParams(new URL(url).search);
      const keyword = params.get('query');
      const rows = parseInt(params.get('rows'));
      const selects = params.get('select').split(',');
      const items = mockData.message.items.slice(0, rows).map((item, i) => {
        return selects.reduce((acc, select) => {
          if (select === 'title') item[select] = [`${keyword}-${i}`];
          acc[select] = item[select];
          return acc;
        }, {});
      });

      return Promise.resolve<{ data: CrossRefResponse }>({
        data: { message: { 'total-results': mockData.message['total-results'], items } },
      });
    });
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SearchController],
      providers: [
        SearchService,
        {
          provide: HttpService,
          useValue: httpService,
        },
      ],
    }).compile();
    controller = module.get(SearchController);
  });

  it('search controller 정의', () => {
    expect(controller).toBeDefined();
  });

  it('getAutoCompletePapers - keyword=coffee 일 때 PaperInfo[]를 return', async () => {
    const keyword = 'coffee';
    const items = await controller.getAutoCompletePapers(keyword);
    expect(items.length).toBe(5);
    items.forEach((item) => {
      expect(item).toBeInstanceOf(PaperInfo);
    });
  });

  it(`getAutoCompletePapers - keyword='' 일 때 PaperInfoExtended[]를 return`, async () => {
    const keyword = 'coffee';
    const { papers: items, pageInfo } = await controller.getPapers(keyword);
    expect(items.length).toBe(20);
    expect(pageInfo.totalItems).toBe(28810);
    items.forEach((item) => {
      expect(item).toBeInstanceOf(PaperInfoExtended);
    });
  });
});
