import { ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { SearchValidationPipe } from '../pipe/search.pipe';

describe('keyword validation pipe', () => {
  const target = new SearchValidationPipe();
  const metadata: ArgumentMetadata = {
    type: 'query',
    data: 'keyword',
  };
  it('client로부터 전달받은 keyword가 query params를 변경시키지 않는가', () => {
    const keywords = ['coffee', 'coffee&row=10', '?query=coffee', 'hello  coffee'];
    const encodedWords = keywords.map((keyword) => {
      return target.transform(keyword, metadata);
    });
    encodedWords.forEach((word) => {
      const params = new URLSearchParams(word);
      expect(Array.from(params.keys()).length).toBe(1);
    });
  });

  it('공백으로 검색시 throw 발생', () => {
    const keyword = '';
    expect(() => target.transform(keyword, metadata)).toThrowError(
      new BadRequestException('공백으로는 검색할 수 없습니다.'),
    );
  });
});
