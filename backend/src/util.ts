const BASE_URL = 'https://api.crossref.org/works';
export const CROSSREF_API_URL = (keyword: string, rows = 5, selects: string[] = ['author', 'title', 'DOI'], page = 1) =>
  `${BASE_URL}?query=${keyword}&rows=${rows}&select=${selects.join(',')}&offset=${rows * (page - 1)}`;
export const CROSSREF_API_PAPER_URL = (doi: string) => `${BASE_URL}/${doi}`;
export const CROSSREF_CRALWING_URL = (
  keyword: string,
  rows = 1000,
  selects: string[] = ['author', 'title', 'DOI'],
  cursor: string,
) => `${BASE_URL}?query=${keyword}&rows=${rows}&select=${selects.join(',')}&cursor=${cursor}`;
class Queue {
  data: Set<Array<string>>;
  constructor() {
    this.data = new Set();
  }
  pop() {
    const firstValue = this.data[Symbol.iterator]().next().value;
    this.data.delete(firstValue);
    return firstValue;
  }
  push(value: Array<string>) {
    if (!this.data.has(value)) this.data.add(value);
  }
  isEmpty() {
    if (this.data.size == 0) return true;
    else return false;
  }
}
export const CROSSREF_CACHE_QUEUE = new Queue();
