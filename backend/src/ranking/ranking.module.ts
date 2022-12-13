import { Module } from '@nestjs/common';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { RankingController } from './ranking.controller';
import { RankingService } from './ranking.service';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { REDIS_HOST, REDIS_PASSWORD, REDIS_PORT } from 'src/envLayer';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: `.dev.env` }),
    RedisModule.forRoot({
      config: {
        host: REDIS_HOST,
        port: REDIS_PORT,
        password: REDIS_PASSWORD,
      },
    }),
    ScheduleModule.forRoot(),
  ],
  controllers: [RankingController],
  providers: [RankingService],
})
export class RankingModule {}
