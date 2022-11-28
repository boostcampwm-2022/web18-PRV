/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Transform } from 'class-transformer';
import { IsOptional, IsPositive, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SearchDto {
  @ApiProperty({
    example: 'einstein',
    description: '검색 키워드 (2글자 이상)',
    required: true,
  })
  @Transform((params) => encodeURI(params.value).trim())
  @IsString()
  @MinLength(2)
  keyword: string;

  @ApiPropertyOptional({
    example: 20,
    description: '페이지별 검색결과 갯수',
    default: 20,
  })
  @IsOptional()
  @Transform((params) => parseInt(params.value))
  @IsPositive()
  rows: number = 20;

  @ApiPropertyOptional({
    example: 1,
    description: '페이지 번호',
    default: 1,
  })
  @IsOptional()
  @Transform((params) => parseInt(params.value))
  @IsPositive()
  page: number = 1;
}
export class AutoCompleteDto {
  @ApiProperty({
    example: 'einstein',
    description: '검색 키워드 (2글자 이상)',
  })
  @IsString()
  @MinLength(2)
  keyword: string;
}
export class GetPaperDto {
  @ApiProperty({
    example: '10.1234/qwer.asdf',
    description: '논문의 DOI',
  })
  @IsString()
  doi: string;
}
