import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

const MAX_RETRY_COUNT = 5;

const customAxiosInstance = (baseURL: string) => {
  const axiosInstance = axios.create({
    baseURL,
  });
  const onFulfilled = (response: any) => response;
  let retryCount = 0;

  const retry = (errorConfig: AxiosRequestConfig<unknown>) => {
    retryCount += 1;
    if (retryCount > MAX_RETRY_COUNT) {
      throw new Error('MAX_RETRY_EXCEEDED');
    }
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(axiosInstance.request(errorConfig));
      }, 500);
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

  getAutoComplete(keyword: string) {
    return this.instance.get(`/auto-complete?keyword=${keyword}`);
  }
}
