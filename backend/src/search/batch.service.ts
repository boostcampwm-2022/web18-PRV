import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class BatchService {
  private keywordQueue: string[] = [];
  private urlQueue: string[] = [];

  constructor(private readonly httpService: HttpService) {}
  pushKeyword(keyword: string) {
    // (만약 일정 시간안에 검색했던 키워드라면, 다시 keywordQueue에 push할 필요는 없을듯 Redis TTL 사용할 수 있을듯)
    this.keywordQueue.push(keyword);
  }

  // BatchService의 목적 : 논문을 최대한 많이 우리 DB로 가져오기
  // keyword 검색 -> BatchService에 키워드 추가
  // (만약 일정 시간안에 검색했던 키워드라면, 다시 keywordQueue에 push할 필요는 없을듯 Redis TTL 사용할 수 있을듯)
  // keyword가 keywordQueue에 push되면
  // 1. urlQueue에 keyword에 해당하는 모든 pagination 된 url들 집어넣기 (rows=2000? 괜찮을까?)
  // 2. urlQueue에 데이터가 들어오면, runBatch가 돌아가야함 (setInterval? or Observer?)
  // 3. runBatch에서는 적당량의 요청(ex 50개)을 잘라서 보내야함 (이 때 axios instance를 별도로 만들어서 사용하면 자동 retry 해결)
  // 4. 이미 elasticsearch에 들어가있는 자료일 수 있음.  crossref api에서는 create 역순으로 정렬되어있던가... 할 필요가 있음. sort=created,DESC였나
  // Q. 중복 push를 허용할 것인가 / 넣기 전에 애초에 걸러버릴 것인가.
  // 5. batch 작업을 통해 얻어진 결과들은 elasticsearch에 인덱싱 되어야함.

  pushUrl(url: string) {
    this.urlQueue.push(url);
  }
  async runBatch() {
    const num = 50;
    const batch = this.urlQueue.slice(0, num);
    // TODO : 실패한 url retry
    await Promise.allSettled(batch.map((url) => this.httpService.axiosRef.get(url)));
  }
}
