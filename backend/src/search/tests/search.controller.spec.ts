import { SearchController } from '../search.controller';
import { SearchService } from '../search.service';
import { HttpService } from '@nestjs/axios';
import { PaperInfo, PaperInfoDetail, PaperInfoExtended } from '../entities/crossRef.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { mockBatchService, mockElasticService, mockHttpService, mockRankingService } from './search.service.mock';
import { RankingService } from '../../ranking/ranking.service';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { BatchService } from 'src/batch/batch.service';

describe('SearchController', () => {
  let controller: SearchController;
  let service: SearchService;
  let app: INestApplication;

  let spyGetElasticSearch: jest.SpyInstance;
  const keyword = 'coffee';

  beforeEach(async () => {
    const httpService = mockHttpService();
    const rankingService = mockRankingService();
    const elasticService = mockElasticService();
    const batchService = mockBatchService();

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
        {
          provide: BatchService,
          useValue: batchService,
        },
      ],
    }).compile();
    controller = module.get(SearchController);
    service = module.get(SearchService);
    spyGetElasticSearch = jest.spyOn(service, 'getElasticSearch');
    // spyGetCrossRefData = jest.spyOn(service, 'getCrossRefData');

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });
  afterEach(() => app.close());

  describe('/search/auto-complete', () => {
    it('getAutoCompletePapers - keyword=coffee 일 때 PaperInfo[]를 return', async () => {
      // Case 1. elasticsearch에 data가 없을 경우
      const itemsByCrossRef = await controller.getAutoCompletePapers({ keyword });
      expect(itemsByCrossRef.length).toBe(5);
      itemsByCrossRef.forEach((item) => {
        expect(item instanceof PaperInfo).toBe(true);
      });

      // Case 2. elasticsearch에 data가 있는 경우
      const itemsByElasticsearch = await controller.getAutoCompletePapers({ keyword });
      expect(itemsByElasticsearch.length).toBe(5);
      itemsByElasticsearch.forEach((item) => {
        expect(item instanceof PaperInfo).toBe(true);
      });

      expect(spyGetElasticSearch).toBeCalledTimes(2);
    });
    it('keyword 미포함시 error - GET /search/auto-complete?keyword=', () => {
      const url = (keyword: string) => `/search/auto-complete?keyword=${keyword}`;
      request(app.getHttpServer()).get(url('')).expect(400);
    });
  });
  describe('/search', () => {
    const DEFAULT_ROWS = 20;
    const TOTAL_ITEMS = 28810;
    it(`getPapers - keyword='coffee' 일 때 PaperInfoExtended[]를 return`, async () => {
      const keyword = 'coffee';
      const { papers: items, pageInfo } = await controller.getPapers({ keyword, rows: 20, page: 1 });
      expect(items.length).toBe(DEFAULT_ROWS);
      expect(pageInfo.totalItems).toBe(TOTAL_ITEMS);
      items.forEach((item) => {
        expect(item).toBeInstanceOf(PaperInfoExtended);
      });
      expect(spyGetElasticSearch).toBeCalledTimes(1);
    });
    it('keyword 미포함시 error - GET /search?keyword=', () => {
      const url = (keyword: string) => `/search?keyword=${keyword}`;
      request(app.getHttpServer()).get(url('')).expect(400);
    });
    it('rows<=0 이거나, rows 값이 integer가 아닐 경우 error - GET /search?keyword=coffee&rows=<rows>', () => {
      const url = (rows: string | number) => `/search?keyword=${keyword}&rows=${rows}`;
      const rowsNotAvailables = [-1, -0.1, '0', 'value'];
      rowsNotAvailables.forEach((value) => {
        request(app.getHttpServer()).get(url(value)).expect(400);
      });
    });
    it('page<=0 이거나, page 값이 integer가 아닐 경우 error - GET /search?keyword=coffee&page=<page>', () => {
      const url = (page: string | number) => `/search?keyword=${keyword}&page=${page}`;
      const pageNotAvailables = [-1, -0.1, '0', 'value'];
      pageNotAvailables.forEach((value) => {
        request(app.getHttpServer()).get(url(value)).expect(400);
      });
    });
    it('page>max 이면 error - GET /search?keyword=coffee&page=<page>', () => {
      const url = (page: string | number) => `/search?keyword=${keyword}&page=${page}`;
      const maxPage = Math.ceil(TOTAL_ITEMS / DEFAULT_ROWS);
      request(app.getHttpServer())
        .get(url(maxPage + 1))
        .expect(404);
    });
  });

  describe('/search/paper', () => {
    it(`getPaper - doi=10.1234/some_doi 일 때 PaperInfoDetail을 return`, async () => {
      const doi = '10.1234/some_doi';
      const paper = await controller.getPaper({ doi });
      expect(paper.references).toBe(10);
      expect(paper.referenceList.length).toBe(10);
      expect(() => new PaperInfoDetail(paper)).not.toThrow();
    });
    it('doi가 입력되지 않을 경우 error - GET /search/paper?doi=', () => {
      const url = (keyword: string) => `/search/paper?doi=${keyword}`;
      request(app.getHttpServer()).get(url('')).expect(400);
    });
  });
});
