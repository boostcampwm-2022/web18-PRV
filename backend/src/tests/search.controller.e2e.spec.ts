import { Test, TestingModule } from '@nestjs/testing';
import { SearchController } from '../search/search.controller';
import { SearchService } from '../search/search.service';
import { PaperInfo, PaperInfoExtended } from '../search/entities/crossRef.entity';
import { HttpModule } from '@nestjs/axios';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';

describe('(e2e) SearchController - /search/auto-complete', () => {
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

  it('keyword 포함 검색 - GET /search/auto-complete?keyword=coffee', async () => {
    const keyword = 'coffee';
    const res = await request(app.getHttpServer()).get(url(keyword));
    const items: PaperInfo[] = JSON.parse(res.text);
    expect(items.length).toBe(5);
    // TODO: type check
    // items.forEach((item) => {
    //   expect(item).toBeInstanceOf(PaperInfo);
    // });
  });
  it('keyword 미포함시 error - GET /search/auto-complete?keyword=', () => {
    return request(app.getHttpServer()).get(url('')).expect(400);
  });
});

describe('(e2e) SearchController - /search', () => {
  let app: INestApplication;
  const url = (keyword: string) => `/search?keyword=${keyword}`;

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

  it('keyword 포함 검색 - GET /search?keyword=coffee', async () => {
    const keyword = 'coffee';
    const res = await request(app.getHttpServer()).get(url(keyword));
    const info: { papers: PaperInfoExtended[] } = JSON.parse(res.text);
    expect(info.papers.length).toBe(20);
    // TODO: type check
    // items.forEach((item) => {
    //   expect(item).toBeInstanceOf(PaperInfoExtended);
    // });
  });
  it('keyword 미포함시 error - GET /search?keyword=', () => {
    return request(app.getHttpServer()).get(url('')).expect(400);
  });
});
