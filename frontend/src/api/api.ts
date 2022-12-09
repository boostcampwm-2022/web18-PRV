import axios, { AxiosInstance } from 'axios';
export interface IGetSearch {
  keyword: string;
  page: string;
  rows?: string;
}

export interface IGetAutoComplete {
  keyword: string;
}

export interface IGetPaperDetail {
  doi: string;
}

export default class Api {
  private readonly baseURL = process.env.REACT_APP_BASE_URL;
  private readonly instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({ baseURL: this.baseURL });
  }

  getKeywordRanking() {
    return this.instance.get('/keyword-ranking');
  }

  getSearch(params: IGetSearch) {
    params.keyword = decodeURI(params.keyword);
    return this.instance.get('/search', {
      params,
    });
  }

  getAutoComplete(params: IGetAutoComplete) {
    return this.instance.get('/search/auto-complete', { params });
  }

  getPaperDetail(params: IGetPaperDetail) {
    return this.instance.get(`/search/paper`, { params });
  }
}
