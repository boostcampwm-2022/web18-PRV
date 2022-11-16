import { Module } from '@nestjs/common';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { RankingController } from './ranking.controller';
import { RankingService } from './ranking.service';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: `.dev.env` }),
    RedisModule.forRoot({
      config: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT, 10) || 6379,
      },
    }),
  ],
  controllers: [RankingController],
  providers: [RankingService],
})
export class RankingModule {}
