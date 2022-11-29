import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RankingDocument = SearchRanking & Document;

@Schema()
export class SearchRanking {
  @Prop()
  keyword: string;

  @Prop()
  count: number;
}

export const RankingSchema = SchemaFactory.createForClass(SearchRanking);
