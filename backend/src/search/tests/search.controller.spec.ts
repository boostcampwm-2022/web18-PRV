import { SearchController } from '../search.controller';
import { SearchService } from '../search.service';
import { HttpService } from '@nestjs/axios';
import { PaperInfo, PaperInfoExtended } from '../entities/crossRef.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { mockElasticService, mockHttpService, mockRankingService } from './search.service.mock';
import { RankingService } from '../../ranking/ranking.service';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';

describe('SearchController', () => {
  let controller: SearchController;
  let app: INestApplication;

  beforeEach(async () => {
    const httpService = mockHttpService();
    const rankingService = mockRankingService();
    const elasticService = mockElasticService();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SearchController],
      providers: [
        SearchService,
        {
          provide: RankingService,
          useValue: rankingService,
        },
        {
          provide: HttpService,
          useValue: httpService,
        },
        {
          provide: ElasticsearchService,
          useValue: elasticService,
        },
      ],
    }).compile();
    controller = module.get(SearchController);
    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  describe('/search/auto-complete', () => {
    it('getAutoCompletePapers - keyword=coffee 일 때 PaperInfo[]를 return', async () => {
      const keyword = 'coffee';
      const items = await controller.getAutoCompletePapers({ keyword });
      expect(items.length).toBe(5);
      expect(() => {
        items.forEach((item) => {
          const c = class T implements PaperInfo {};
          Object.entries(item).forEach(([key, value]) => {
            try {
              c[key] = value;
            } catch (err) {
              throw err;
            }
          });
        });
      }).not.toThrow();
    });
    it('keyword 미포함시 error - GET /search/auto-complete?keyword=', () => {
      const url = (keyword: string) => `/search/auto-complete?keyword=${keyword}`;
      return request(app.getHttpServer()).get(url('')).expect(400);
    });
  });
  describe('/search', () => {
    it(`getPapers - keyword='coffee' 일 때 PaperInfoExtended[]를 return`, async () => {
      const keyword = 'coffee';
      const { papers: items, pageInfo } = await controller.getPapers({ keyword, rows: 20, page: 1 });
      expect(items.length).toBe(20);
      expect(pageInfo.totalItems).toBe(28810);
      expect(() => {
        items.forEach((item) => {
          const c = class T implements PaperInfoExtended {};
          Object.entries(item).forEach(([key, value]) => {
            try {
              c[key] = value;
            } catch (err) {
              throw err;
            }
          });
        });
      }).not.toThrow();
    });
    it('keyword 미포함시 error - GET /search?keyword=', () => {
      const url = (keyword: string) => `/search?keyword=${keyword}`;
      return request(app.getHttpServer()).get(url('')).expect(400);
    });
    it('rows<=0 이거나, rows 값이 integer가 아닐 경우 error - GET /search?keyword=coffee&rows=<rows>', () => {
      const url = (keyword: string | number) => `/search?keyword=${keyword}`;
      const rowsNotAvailables = [-1, -0.1, '0', 'value'];
      rowsNotAvailables.forEach((value) => {
        request(app.getHttpServer()).get(url(value)).expect(400);
      });
    });
    it('page<=0 이거나, page 값이 integer가 아닐 경우 error - GET /search?keyword=coffee&page=<page>', () => {
      const url = (keyword: string | number) => `/search?keyword=${keyword}`;
      const pageNotAvailables = [-1, -0.1, '0', 'value'];
      pageNotAvailables.forEach((value) => {
        request(app.getHttpServer()).get(url(value)).expect(400);
      });
    });
  });

  describe('/search/paper', () => {
    it(`getPaper - doi=10.1234/some_doi 일 때 PaperInfoDetail을 return`, async () => {
      const doi = '10.1234/some_doi';
      const paper = await controller.getPaper({ doi });
      expect(paper.references).toBe(5);
      expect(paper.referenceList.length).toBe(5);
    });
  });
});
