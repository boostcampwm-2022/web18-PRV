import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class PaperInfo {
  @ApiProperty()
  title: string;

  @ApiPropertyOptional()
  authors?: string[];

  @ApiProperty()
  doi?: string;

  @ApiProperty()
  key?: string;

  constructor(body: PaperInfo) {
    this.title = body.title;
    this.authors = body.authors;
    this.doi = this.key = body.doi.toLowerCase();
  }
}
export class PaperInfoExtended extends PaperInfo {
  @ApiPropertyOptional()
  publishedAt?: string;

  @ApiPropertyOptional()
  citations?: number;

  @ApiPropertyOptional()
  references?: number;

  constructor(body: PaperInfoExtended) {
    super(body);
    this.publishedAt = body.publishedAt;
    this.citations = body.citations;
    this.references = body.references;
  }
}
export class PaperInfoDetail extends PaperInfoExtended {
  @ApiPropertyOptional({ type: PaperInfoExtended, isArray: true })
  referenceList?: PaperInfoExtended[];

  constructor(body: PaperInfoDetail) {
    super(body);
    this.referenceList = body.referenceList;
  }
}
export class ReferenceInfo {
  issn?: string;
  'standards-body'?: string;
  issue?: string;
  key?: string;
  'series-title'?: string;
  'isbn-type'?: string;
  'doi-asserted-by'?: string;
  'first-page'?: string;
  isbn?: string;
  DOI?: string;
  component?: string;
  'article-title'?: string;
  'volume-title'?: string;
  volume?: string;
  author?: string;
  'standard-designator'?: string;
  year?: string;
  unstructured?: string;
  edition?: string;
  'journal-title'?: string;
  'issn-type'?: string;
}
export interface CrossRefResponse {
  message: {
    'next-cursor'?: string;
    'total-results': number;
    items: CrossRefItem[];
  };
}

export interface CrossRefItem {
  title?: string[];
  author?: {
    given?: string;
    family?: string;
    name?: string;
  }[];
  DOI?: string;
  created?: {
    'date-time': string;
  };
  'is-referenced-by-count'?: number;
  'reference-count'?: number;
  reference?: ReferenceInfo[];
}
export interface CrossRefPaperResponse {
  message: CrossRefItem & { 'next-cursor'?: string; 'total-results'?: number };
}
