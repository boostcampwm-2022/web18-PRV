import { Controller, Get } from '@nestjs/common';
import { PopularService } from './popular.service';

@Controller('popular')
export class PopularController {
	constructor(private readonly popularService: PopularService) {}
	@Get()
	getAll() {
		return this.popularService.getAll();
	}
}
