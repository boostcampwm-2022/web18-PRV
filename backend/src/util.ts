export const CROSSREF_API_URL = (keyword: string, rows = 5, page = 1, selects: string[] = ['author', 'title', 'DOI']) =>
  `https://api.crossref.org/works?query=${keyword}&rows=${rows}&select=${selects.join(',')}&offset=${
    rows * (page - 1)
  }&mailto=${process.env.MAIL_TO}&sort=is-referenced-by-count`;
