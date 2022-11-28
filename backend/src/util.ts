const BASE_URL = 'https://api.crossref.org/works';
export const CROSSREF_API_URL = (keyword: string, rows = 5, selects: string[] = ['author', 'title', 'DOI'], page = 1) =>
  `${BASE_URL}?query=${keyword}&rows=${rows}&select=${selects.join(',')}&offset=${rows * (page - 1)}`;

export const CROSSREF_API_PAPER_URL = (doi: string) => `${BASE_URL}/${doi}`;
export const CROSSREF_CACHE_QUEUE = [];
