import { Transform } from 'class-transformer';
import { IsOptional, IsPositive, IsString } from 'class-validator';

export class SearchDto {
  @IsOptional()
  @Transform((params) => parseInt(params.value))
  @IsPositive()
  rows = 20;

  @IsOptional()
  @Transform((params) => parseInt(params.value))
  @IsPositive()
  page = 1;
}

export class GetPaperDto {
  @IsString()
  doi: string;
}
