const BASE_URL = 'https://api.crossref.org/works';
export const CROSSREF_API_URL = (keyword: string, rows = 5, page = 1, selects: string[] = ['author', 'title', 'DOI']) =>
  `${BASE_URL}?query=${keyword}&rows=${rows}&select=${selects.join(',')}&offset=${rows * (page - 1)}&mailto=${
    process.env.MAIL_TO
  }`;

export const MAX_ROWS = 1000;
export const CROSSREF_API_URL_CURSOR = (
  keyword: string,
  cursor = '*',
  rows = MAX_ROWS,
  selects: string[] = ['title', 'author', 'created', 'is-referenced-by-count', 'references-count', 'DOI', 'reference'],
) =>
  `${BASE_URL}?query=${keyword}&rows=${rows}&select=${selects.join(',')}&mailto=${
    process.env.MAIL_TO
  }&sort=is-referenced-by-count&cursor=${cursor}`;
export const CROSSREF_API_PAPER_URL = (doi: string) => `${BASE_URL}/${doi}`;
export class Queue<T = string> {
  data: Set<T>;
  constructor() {
    this.data = new Set();
  }
  pop() {
    const firstValue = this.data[Symbol.iterator]().next().value as T;
    this.data.delete(firstValue);
    return firstValue;
  }
  push(value: T) {
    if (!this.data.has(value)) this.data.add(value);
  }
  isEmpty() {
    if (this.data.size == 0) return true;
    else return false;
  }
}
export const CROSSREF_CACHE_QUEUE = new Queue();
export const urlRegex = /(https?:\/\/[^\s]+)/gm;
