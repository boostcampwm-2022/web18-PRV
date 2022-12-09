import { SearchService } from 'src/search/search.service';
import { mockHttpService, mockElasticService } from 'src/search/tests/search.service.mock';
import { DOI_REGEXP } from '../batch.config';
import { DoiBatcher } from '../batcher.doi';
import { SearchBatcher } from '../batcher.search';
import { mockRedisQueue, popDoiItem, popSearchItem } from './batcher.mock';

describe('doiBatcher', () => {
  let batcher: DoiBatcher;

  beforeEach(async () => {
    const redisService = mockRedisQueue(popDoiItem);
    const httpService = mockHttpService();
    const elasticService = mockElasticService();
    batcher = new DoiBatcher(
      redisService,
      httpService.axiosRef,
      new SearchService(elasticService, httpService),
      'doi batcher',
    );
  });
  it('getParamsFromUrl', async () => {
    const items = await batcher.queue.pop(1);
    const { url } = batcher.parseQueueItem(items[0]);
    const { doi } = batcher.getParamsFromUrl(url);
    expect(DOI_REGEXP.test(doi)).toBe(true);
  });
});

describe('searchBatcher', () => {
  let batcher: SearchBatcher;

  beforeEach(async () => {
    const redisService = mockRedisQueue(popSearchItem);
    const httpService = mockHttpService();
    const elasticService = mockElasticService();
    batcher = new SearchBatcher(
      redisService,
      httpService.axiosRef,
      new SearchService(elasticService, httpService),
      'doi batcher',
    );
  });
  it('getParamsFromUrl', async () => {
    const items = await batcher.queue.pop(1);
    const { url } = batcher.parseQueueItem(items[0]);
    const { keyword, cursor } = batcher.getParamsFromUrl(url);
    expect(typeof keyword).toBe('string');
    expect(typeof cursor).toBe('string');
  });
});
