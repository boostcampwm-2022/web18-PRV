import { ArgumentMetadata, BadRequestException, PipeTransform } from '@nestjs/common';

export class SearchValidationPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    if (!this.isKeywordValid(value)) {
      throw new BadRequestException(`empty value`);
    }
    return encodeURIComponent(value);
  }
  private isKeywordValid(value: string) {
    return value && value !== '';
  }
}
