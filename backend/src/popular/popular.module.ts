import { Module } from '@nestjs/common';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { PopularController } from './popular.controller';
import { PopularService } from './popular.service';

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
export class PopularModule {}
