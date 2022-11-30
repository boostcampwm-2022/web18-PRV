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
  describe('/keyword-ranking', () => {
    it('10위까지의 검색어를 가져오기', async () => {
      //Case 1. redis가 비어있을 경우
      const topTen = await controller.getTen();
      expect(topTen.length).toBe(0);
    });
  });
  describe('/keyword-ranking/insert', () => {
    it('검색어 redis에 삽입 후 삽입 여부 확인', async () => {
      const result = await controller.insertCache('keyword');
      expect(result).toBe(1);
    });
  });
});
