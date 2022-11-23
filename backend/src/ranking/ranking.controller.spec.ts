import { RedisModule } from '@liaoliaots/nestjs-redis';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { RankingController } from './ranking.controller';
import { RankingService } from './ranking.service';

describe('RankingServiceTest', () => {
  let controller: RankingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true, envFilePath: `.dev.env` }),
        RedisModule.forRoot({
          config: {
            host: process.env.REDIS_HOST,
            port: parseInt(process.env.REDIS_PORT, 10) || 6379,
            password: process.env.REDIS_PASSWORD,
          },
        }),
      ],
      controllers: [RankingController],
      providers: [RankingService],
    }).compile();
    controller = module.get<RankingController>(RankingController);
  });
  it('get controller', async () => {
    expect(controller).toBeDefined();
  });
  it('get Top10 Redis Data', async () => {
    const topTen = await controller.getTen();
    expect(topTen.length).toBeLessThanOrEqual(10);
  });
});
