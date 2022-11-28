export const PATH_MAIN = '/';
export const PATH_SEARCH_LIST = '/search-list';
export const PATH_DETAIL = '/detail';

export const createDetailQuery = (doi: string) => {
  return `${PATH_DETAIL}?doi=${doi}`;
};
