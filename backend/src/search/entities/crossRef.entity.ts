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
export interface CrossRefResponse {
  message: {
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
}
