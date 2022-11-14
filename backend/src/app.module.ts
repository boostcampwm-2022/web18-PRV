import { Module } from '@nestjs/common';
import { PopularController } from './popular/popular.controller';
import { PopularService } from './popular/popular.service';
import { RedisModule } from '@liaoliaots/nestjs-redis';

@Module({
	imports: [
		RedisModule.forRoot({
			config: {
				host: 'localhost',
				port: 3003,
			},
		}),
	],
	controllers: [PopularController],
	providers: [PopularService],
})
export class AppModule {}
