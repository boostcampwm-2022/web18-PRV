import { ArgumentMetadata, BadRequestException, PipeTransform } from '@nestjs/common';

export class KeywordValidationPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    if (!this.isKeywordValid(value)) {
      throw new BadRequestException(`2자 이상으로 검색할 수 있습니다.`);
    }
    return encodeURIComponent(value);
  }
  private isKeywordValid(value: string) {
    return value && value !== '' && value.length > 1;
  }
}

export class PositiveIntegerValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!this.isQueryNumberPositive(value)) {
      throw new BadRequestException(`${metadata.data}의 값은 양수여야합니다.`);
    }
    return parseInt(value);
  }
  private isQueryNumberPositive(value: any) {
    if (Number.isNaN(parseInt(value))) return false;
    if (value <= 0) return false;
    return true;
  }
}
