export const CROSSREF_API_URL = (keyword: string, rows = 5, selects: string[] = ['author', 'title', 'DOI'], page = 1) =>
  `https://api.crossref.org/works?query=${keyword}&rows=${rows}&select=${selects.join(',')}&offset=${
    rows * (page - 1)
  }`;
