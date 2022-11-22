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

export class PositiveIntegerValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!this.isQueryNumberPositive(value)) {
      throw new BadRequestException(`${metadata.data}의 값은 양수여야합니다.`);
    }
    if (value === undefined) value = 1;
    return parseInt(value);
  }
  private isQueryNumberPositive(value: any) {
    if (value !== undefined && Number.isNaN(parseInt(value))) return false;
    if (value < 0) return false;
    return true;
  }
}
