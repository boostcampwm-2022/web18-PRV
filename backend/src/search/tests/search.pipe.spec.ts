import { ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { SearchValidationPipe } from '../pipe/search.pipe';

describe('keyword validation', () => {
  const target = new SearchValidationPipe();
  const metadata: ArgumentMetadata = {
    type: 'query',
    data: 'keyword',
  };
  it('사용자의 키워드가 crossref query에 영향을 주지 않는다.', () => {
    const keywords = ['coffee', 'coffee&row=10', '?query=coffee', 'hello  coffee'];
    const encodedWords = keywords.map((keyword) => {
      return target.transform(keyword, metadata);
    });
    encodedWords.forEach((word) => {
      const params = new URLSearchParams(word);
      expect(Array.from(params.keys()).length).toBe(1);
    });
  });

  it('공백 검색시 throw', () => {
    const keyword = '';
    expect(() => target.transform(keyword, metadata)).toThrow(BadRequestException);
  });
});
