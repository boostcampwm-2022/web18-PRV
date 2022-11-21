export interface PaperInfo {
  title?: string;
  authors?: string[];
  doi?: string;
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
  }[];
  DOI?: string;
}
