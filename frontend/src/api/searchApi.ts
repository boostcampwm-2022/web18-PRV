import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

export interface IGetSearch {
  keyword?: string;
  page?: string;
  isDoiExist?: string;
}

export interface IGetAutoComplete {
  keyword: string;
}

const MAX_RETRY_COUNT = 5;

const customAxiosInstance = (baseURL: string) => {
  const axiosInstance = axios.create({
    baseURL,
  });
  const onFulfilled = (response: AxiosResponse) => response;
  let retryCount = 0;

  const retry = (errorConfig: AxiosRequestConfig<unknown>) => {
    retryCount += 1;
    if (retryCount > MAX_RETRY_COUNT) {
      throw new Error('MAX_RETRY_EXCEEDED');
    }
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(axiosInstance.request(errorConfig));
      });
    });
  };
  const onRejected = (error: { config: AxiosRequestConfig<unknown> }) => {
    if (error.config) {
      return retry(error.config);
    }
    return Promise.reject(error);
  };
  axiosInstance.interceptors.response.use(onFulfilled, onRejected);
  return axiosInstance;
};

export default class SearchApi {
  private readonly baseURL = '/search';
  private readonly instance: AxiosInstance;

  constructor() {
    this.instance = customAxiosInstance(this.baseURL);
  }

  getSearch(params: IGetSearch) {
    return this.instance.get('', { params });
  }

  getAutoComplete(params: IGetAutoComplete) {
    return this.instance.get('/auto-complete', { params });
  }
}
