import axios, { AxiosInstance } from 'axios';

export interface IGetSearch {
  keyword?: string;
  page?: string;
  isDoiExist?: string;
}

export interface IGetAutoComplete {
  keyword: string;
}

export default class Api {
  private readonly baseURL = 'http://49.50.172.204:4000/';
  private readonly instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({ baseURL: this.baseURL });
  }

  getKeywordRanking() {
    return this.instance.get('/keyword-ranking');
  }

  getSearch(params: IGetSearch) {
    return this.instance.get('/search', { params });
  }

  getAutoComplete(params: IGetAutoComplete) {
    return this.instance.get('/search/auto-complete', { params });
  }
}
