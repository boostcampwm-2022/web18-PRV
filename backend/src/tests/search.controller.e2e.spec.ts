import { Test, TestingModule } from '@nestjs/testing';
import { SearchController } from '../search/search.controller';
import { SearchService } from '../search/search.service';
import { HttpModule } from '@nestjs/axios';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';

describe('SearchController (e2e)', () => {
  let app: INestApplication;
  const url = (keyword: string) => `/search/auto-complete?keyword=${keyword}`;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [SearchController],
      providers: [SearchService],
    }).compile();
    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  it('(GET) /search/auto-complete?keyword=coffee', () => {
    const keyword = 'coffee';
    return request(app.getHttpServer())
      .get(url(keyword))
      .then((res) => JSON.parse(res.text))
      .then((res) => {
        expect(res.length).toBe(5);
      });
  });
  it('(GET) keyword 미포함 - /search/auto-complete?keyword=', () => {
    return request(app.getHttpServer()).get(url('')).expect(400);
  });

  it('(GET)  - /search/auto-complete', () => {
    return request(app.getHttpServer()).get(url('')).expect(400);
  });
});
