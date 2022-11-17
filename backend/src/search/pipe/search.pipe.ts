import { ArgumentMetadata, BadRequestException, PipeTransform } from '@nestjs/common';

export class SearchValidationPipe implements PipeTransform {
  // 사용자의 keyword 검색은 따옴표로 감싼다.
  transform(value: string, metadata: ArgumentMetadata) {
    if (!this.isKeywordValid(value)) {
      throw new BadRequestException(`empty value`);
    }
    return `"${value}"`;
  }
  private isKeywordValid(value: string) {
    return value && value !== '';
  }
}
