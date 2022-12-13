import { RedisModule } from '@liaoliaots/nestjs-redis';
import { BadRequestException, INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import e from 'express';
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
    it('redis date가 10개 이하인 경우', async () => {
      //Case 1. redis date가 10개 이하인 경우
      const topTen = await service.getTen();
      expect(topTen.length).toBeLessThanOrEqual(10);
    });
    it('데이터 삽입 후 topTen 체크', async () => {
      //Case 2. 데이터 삽입 후 topTen 체크
      const flag = await service.insertRedis('9번째 데이터');
      expect(flag).toBe('new');
      const topTen = await controller.getTen();
      expect(topTen.length).toBe(9);
      const flag2 = await service.insertRedis('10번째 데이터');
      expect(flag2).toBe('new');
      const topTen2 = await controller.getTen();
      expect(topTen2.length).toBe(10);
    });
    it('2위인 "사랑해요" 데이터가 한번 더 검색시 1위로 업데이트', async () => {
      //Case 3. 2위인 "사랑해요" 데이터가 한번 더 검색시 1위로 업데이트
      const flag = await service.insertRedis('사랑해요');
      expect(flag).toBe('update');
      const topTen = await controller.getTen();
      expect(topTen[0].keyword).toBe('부스트캠프');
    });
  });
  describe('/keyword-ranking/insert', () => {
    // Case1. 기존 redis에 없던 데이터 삽입
    it('기존 redis에 없던 데이터 삽입', async () => {
      const result = await service.insertRedis('newData');
      expect(result).toBe('new');
    });
    // Case2. 기존 redis에 있던 데이터 삽입
    it('기존 redis에 있던 데이터 삽입', async () => {
      const result = await service.insertRedis('부스트캠프');
      expect(result).toBe('update');
    });
    //Case3. redis에 빈 검색어 입력
    it('빈 검색어 redis에 삽입', async () => {
      await expect(service.insertRedis('')).rejects.toEqual(
        new BadRequestException({ status: 400, error: 'bad request' }),
      );
    });
    //Case4. insert 실패시 타임 아웃 TimeOut
    it('insert 실패시 타임 아웃 TimeOut', async () => {
      await expect(service.insertRedis('')).rejects.toEqual(
        new BadRequestException({ status: 400, error: 'bad request' }),
      );
    });
  });
});
