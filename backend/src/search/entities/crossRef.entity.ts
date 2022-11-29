export class PaperInfo {
  title?: string;
  authors?: string[];
  doi?: string;
}
export class PaperInfoExtended extends PaperInfo {
  publishedAt?: string;
  citations?: number;
  references?: number;
}
export class PaperInfoDetail extends PaperInfoExtended {
  referenceList?: ReferenceInfo[];
}
export interface ReferenceInfo {
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
  message: CrossRefItem & { 'next-cursor'?: string; 'total-results': number };
}
