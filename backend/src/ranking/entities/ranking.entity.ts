import { ApiProperty } from '@nestjs/swagger';
export class Ranking {
  @ApiProperty()
  keyword: string;

  @ApiProperty()
  changeRanking: number;
}
export class redisRanking {
  keyword: string;
  count: number;
}
