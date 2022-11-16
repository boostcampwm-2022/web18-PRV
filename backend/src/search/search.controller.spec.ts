import { Test, TestingModule } from '@nestjs/testing';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { HttpModule } from '@nestjs/axios';
import { BadRequestException } from '@nestjs/common';

describe('SearchController', () => {
	let controller: SearchController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [HttpModule],
			controllers: [SearchController],
			providers: [SearchService],
		}).compile();

		controller = module.get<SearchController>(SearchController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});

	it('get auto-complete data', async () => {
		const items = await controller.getAutoCompletePapers('covid');
		expect(items.length).toBe(5);
	});

	it('throw err when keyword is empty', async () => {
		try {
			await controller.getAutoCompletePapers('');
		} catch (e) {
			expect(e).toBeInstanceOf(TypeError);
		}
	});
});
