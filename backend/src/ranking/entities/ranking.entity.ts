import { ApiProperty } from '@nestjs/swagger';
export class Ranking {
  @ApiProperty()
  keyword: string;

  @ApiProperty()
  count: number;
}
