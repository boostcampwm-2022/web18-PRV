export const PATH_MAIN = '/';
export const PATH_SEARCH_LIST = '/search-list';
export const PATH_DETAIL = '/detail';

export const createSearchQuery = (keyword: string) => {
  return `${PATH_SEARCH_LIST}?keyword=${keyword}&page=1&rows=20`;
};

export const createDetailQuery = (doi: string) => {
  return `${PATH_DETAIL}?doi=${doi}`;
};
