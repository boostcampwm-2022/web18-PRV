import { Module } from '@nestjs/common';
import { PopularModule } from './popular/popular.module';

@Module({
	imports: [PopularModule],
})
export class AppModule {}
