import axios from 'axios';

const api = axios.create({
  baseURL: 'http://49.50.172.204:4000',
});

export const getKeywordRanking = () => {
  return api.get('/keyword-ranking').then((res) => res.data);
};
