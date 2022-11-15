import { Module } from '@nestjs/common';
import { PopularModule } from './popular/popular.module';
import { SearchModule } from './search/search.module';

@Module({
	imports: [PopularModule, SearchModule],
})
export class AppModule {}
