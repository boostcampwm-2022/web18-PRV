import mockCrossRefData from './crossref.mock';
import mockSearchData from './searchdata.mock';
import { HttpService } from '@nestjs/axios';
import { CrossRefPaperResponse, CrossRefResponse, PaperInfo, PaperInfoDetail } from '../entities/crossRef.entity';
import { ElasticsearchService } from '@nestjs/elasticsearch';

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
  const search = jest.fn().mockImplementation(({ size }) => {
    return Promise.resolve({
      hits: {
        total: {
          value: 28810,
        },
        hits: mockSearchData
          .map((data, key) => {
            return {
              _source: { ...new PaperInfo(data), key },
            };
          })
          .slice(0, size),
      },
    });
  });
  const get = jest.fn().mockResolvedValue({
    _source: {
      ...mockSearchData[0],
      referenceList: Array.from({ length: mockSearchData[0].references || 0 }, (_, i) => {
        return { key: mockSearchData[i].doi };
      }),
    },
  });
  const mget = jest.fn().mockResolvedValue({
    docs: Array.from({ length: mockSearchData[0].references || 0 }, (_, i) => {
      const data = mockSearchData[i];
      return { _id: data.doi, found: Math.random() > 0.5, _source: data };
    }),
  });
  const bulk = jest.fn().mockResolvedValue([]);
  const elasticService = { index, search, get, mget, bulk };
  return elasticService as unknown as ElasticsearchService;
}

export function mockRankingService() {
  const insertRedis = jest.fn().mockResolvedValue(() => {
    console.log('insertRedis 사용했다하하ㅏㅎ하ㅏ');
    return true;
  });
  const rankingService = { insertRedis };
  return rankingService;
}

export function mockBatchService() {
  const setKeyword = jest.fn().mockResolvedValue(() => {
    return true;
  });
  const doiBatcher = {
    pushToQueue: jest.fn(),
  };
  const searchBatcher = {
    pushToQueue: jest.fn(),
  };
  const batchService = { setKeyword, doiBatcher, searchBatcher };
  return batchService;
}
