import mockCrossRefData from './crossref.mock';
import mockSearchData from './searchdata.mock';
import { HttpService } from '@nestjs/axios';
import { CrossRefPaperResponse, CrossRefResponse, PaperInfo } from '../entities/crossRef.entity';

export function mockHttpService() {
  const httpService = new HttpService();
  jest.spyOn(httpService['axiosRef'], 'get').mockImplementation((url: string) => {
    const params = new URLSearchParams(new URL(url).search);
    const keyword = params.get('query');
    if (keyword === null) {
      const item = mockCrossRefData.message.items[0];
      return Promise.resolve<{ data: CrossRefPaperResponse }>({
        data: { message: item },
      });
    }
    const rows = parseInt(params.get('rows'));
    const selects = params.get('select').split(',');
    const items = mockCrossRefData.message.items.slice(0, rows).map((item, i) => {
      return selects.reduce((acc, select) => {
        if (select === 'title') item[select] = [`${keyword}-${i}`];
        acc[select] = item[select];
        return acc;
      }, {});
    });

    return Promise.resolve<{ data: CrossRefResponse }>({
      data: { message: { 'total-results': mockCrossRefData.message['total-results'], items } },
    });
  });
  return httpService;
}

export function mockElasticService() {
  // TODO: should mockup index?
  const index = jest.fn().mockResolvedValue(() => {
    return true;
  });
  const search = jest.fn();
  search
    .mockResolvedValueOnce({
      hits: {
        total: {
          value: 0,
        },
      },
    })
    .mockResolvedValue({
      hits: {
        total: {
          value: 222,
        },
        hits: mockSearchData
          .map((data) => {
            return {
              _source: new PaperInfo(data),
            };
          })
          .slice(0, 5),
      },
    });
  const elasticService = { index, search };
  return elasticService;
}

export function mockRankingService() {
  const insertRedis = jest.fn().mockResolvedValue(() => {
    return true;
  });
  const rankingService = { insertRedis };
  return rankingService;
}
