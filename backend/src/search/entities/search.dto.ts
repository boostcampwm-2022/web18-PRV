import { Transform } from 'class-transformer';
import { IsOptional, IsPositive, IsString, Length } from 'class-validator';

export class SearchDto {
  @Transform((params) => encodeURI(params.value).trim())
  @IsString()
  @Length(2)
  keyword: string;

  @IsOptional()
  @Transform((params) => parseInt(params.value))
  @IsPositive()
  rows = 20;

  @IsOptional()
  @Transform((params) => parseInt(params.value))
  @IsPositive()
  page = 1;
}
export class AutoCompleteDto {
  @IsString()
  @Length(2)
  keyword: string;
}
export class GetPaperDto {
  @IsString()
  doi: string;
}
