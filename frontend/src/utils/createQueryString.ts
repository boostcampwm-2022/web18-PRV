import { PATH_DETAIL, PATH_SEARCH_LIST } from '../constants/path';

const DEFAULT_PAGE = 1;
const DEFAULT_ROWS = 20;

export const createSearchQuery = (keyword: string, page?: number, rows?: number) => {
  return `${PATH_SEARCH_LIST}?keyword=${keyword}&page=${page || DEFAULT_PAGE}&rows=${rows || DEFAULT_ROWS}`;
};

export const createDetailQuery = (doi: string) => {
  return `${PATH_DETAIL}?doi=${doi}`;
};
