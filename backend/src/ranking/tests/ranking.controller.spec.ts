import { RedisModule } from '@liaoliaots/nestjs-redis';
import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { RankingController } from '../ranking.controller';
import { RankingService } from '../ranking.service';
import { mockRedisService } from './ranking.service.mock';
describe('RankingServiceTest', () => {
  let controller: RankingController;
  let service: RankingService;
  beforeEach(async () => {
    const rankingService = mockRedisService();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RankingController],
      providers: [RankingService, { provide: RankingService, useValue: rankingService }],
    }).compile();
    controller = module.get<RankingController>(RankingController);
    service = module.get<RankingService>(RankingService);
  });
  describe('/keyword-ranking/insert', () => {
    //Case1. 기존 redis에 없던 데이터 삽입
    // it('검색어 redis에 삽입', async () => {
    //   const result = await controller.insertCache('newData');
    //   expect(result).toBe(true);
    // });
    //Case1. 기존 redis에 있던 데이터 삽입
    it('검색어 redis에 삽입', async () => {
      const result = await controller.insertCache('부스트캠프');
      expect(result).toBe('update');
    });
  });
  describe('/keyword-ranking', () => {
    it('10위까지의 검색어를 가져오기', async () => {
      //Case 1. redis date가 10개 이하인 경우
      const topTen = await controller.getTen();
      expect(topTen.length).toBeLessThanOrEqual(10);
    });
  });
});
