import { Injectable } from '@nestjs/common';
import { Popular } from './entities/popular.entity';
@Injectable()
export class PopularService {
	private populars: Popular[] = [];

	getAll(): Popular[] {
		return this.populars;
	}
}
