import axios, { AxiosInstance } from 'axios';

export interface IRankingData {
  keyword: string;
  count: number;
}

export interface IPapersData {
  papers: IPaper[];
  pageInfo: IPageInfo;
}

export interface IGetSearch {
  keyword: string;
  page: string;
  rows?: string;
}
export interface IGetAutoComplete {
  keyword: string;
}
export interface IAutoCompletedItem {
  authors?: string[];
  doi: string;
  title: string;
}
export interface IGetPaperDetail {
  doi: string;
}
export interface IPaperDetail extends IPaper {
  referenceList: IReference[];
}

export interface IReference {
  key: string;
  title?: string;
  authors?: string[];
  doi?: string;
  publishedAt?: string;
  citations?: number;
  references?: number;
}
export interface IPaper {
  title: string;
  authors: string[];
  doi: string;
  key: string;
  publishedAt: string;
  citations: number;
  references: number;
}

export interface IPageInfo {
  totalItems: number;
  totalPages: number;
}

export default class Api {
  private readonly baseURL = process.env.REACT_APP_BASE_URL;
  private readonly instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({ baseURL: this.baseURL });
  }

  async getKeywordRanking(): Promise<IRankingData[]> {
    const res = await this.instance.get('/keyword-ranking');
    return res.data;
  }

  async getSearch(params: IGetSearch): Promise<IPapersData> {
    params.keyword = decodeURI(params.keyword);
    const res = await this.instance.get('/search', {
      params,
    });
    return res.data;
  }

  async getAutoComplete(params: IGetAutoComplete): Promise<IAutoCompletedItem[]> {
    const res = await this.instance.get('/search/auto-complete', { params });
    return res.data;
  }

  async getPaperDetail(params: IGetPaperDetail): Promise<IPaperDetail> {
    const res = await this.instance.get(`/search/paper`, { params });
    return res.data;
  }
}
