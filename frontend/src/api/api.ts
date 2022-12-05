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
  private readonly baseURL = 'http://localhost:4000/';
  private readonly instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({ baseURL: this.baseURL });
  }

  getKeywordRanking() {
    return this.instance.get('/keyword-ranking');
  }

  getSearch(params: IGetSearch) {
    // const check_kor = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
    // if (params.keyword.match(check_kor)) {
    //   const encodeKeyword = encodeURI(params.keyword);
    //   params.keyword = encodeKeyword;
    //   return this.instance.get('/search', {
    //     params,
    //   });
    // } else {
    //   return this.instance.get('/search', {
    //     params,
    //   });
    // }
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
