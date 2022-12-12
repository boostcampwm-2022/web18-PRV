import { SearchService } from 'src/search/search.service';
import { mockHttpService, mockElasticService } from 'src/search/tests/search.service.mock';
import { BatchService } from '../batch.service';
import { mockRedisQueue, popDoiItem } from './batcher.mock';

describe('doiBatcher', () => {
  let service: BatchService;

  beforeEach(() => {
    const httpService = mockHttpService();
    const elasticService = mockElasticService();
    service = new BatchService(mockRedisQueue(popDoiItem), httpService, new SearchService(elasticService, httpService));
  });
  it('run doi batch', async () => {
    const doiBatcher__runBatch = jest.spyOn(service.doiBatcher, 'runBatch');
    const doiBatcher__pushToQueue = jest.spyOn(service.doiBatcher, 'pushToQueue');

    await service.batchDoiQueue(10);
    expect(doiBatcher__runBatch).toBeCalledTimes(1);
    expect(doiBatcher__pushToQueue).toBeCalledTimes(20);
  });
});
