import { Module } from '@nestjs/common';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { PopularController } from './popular.controller';
import { PopularService } from './popular.service';
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
	controllers: [PopularController],
	providers: [PopularService],
})
export class PopularModule {}
