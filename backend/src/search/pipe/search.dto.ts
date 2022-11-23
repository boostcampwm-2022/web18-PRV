import { IsNotEmpty, IsInt, IsBoolean } from 'class-validator';

export class SearchDto {
  // TODO : SearchValidationPipe 거쳐야함
  // 현재는 crossref query 사용자에 의해 조작 가능
  @IsNotEmpty()
  keyword: string;

  @IsInt()
  rows = 20;

  @IsInt()
  page = 1;

  @IsBoolean()
  hasDoi = true;
}
