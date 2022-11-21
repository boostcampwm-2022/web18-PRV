import { ArgumentMetadata, BadRequestException, PipeTransform } from '@nestjs/common';

export class SearchValidationPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    if (!this.isKeywordValid(value)) {
      throw new BadRequestException(`공백으로는 검색할 수 없습니다.`);
    }
    return encodeURIComponent(value);
  }
  private isKeywordValid(value: string) {
    return value && value !== '';
  }
}
