import { Module } from '@nestjs/common';
import { PopularController } from './popular/popular.controller';
import { PopularService } from './popular/popular.service';

@Module({
	imports: [],
	controllers: [PopularController],
	providers: [PopularService],
})
export class AppModule {}
