import { isEmpty } from 'lodash-es';
import Api, { IAutoCompletedItem, IGetSearch, IPaperDetail, IPapersData, IRankingData } from './../api/api';
import { queryKey } from './query-key';
import { useQuery } from 'react-query';

const api = new Api();

export const useKeywordRankingQuery = (options?: object) => {
  return useQuery<IRankingData[]>([queryKey.KEYWORD_RANKING], () => api.getKeywordRanking(), {
    suspense: false,
    ...options,
  });
};

export const useAutoCompleteQuery = (params: string, options?: object) => {
  return useQuery<IAutoCompletedItem[]>(
    [queryKey.AUTO_COMPLETE, params],
    () => api.getAutoComplete({ keyword: params }),
    {
      suspense: false,
      ...options,
    },
  );
};

export const useSearchQuery = (params: IGetSearch, options?: object) => {
  return useQuery<IPapersData>([queryKey.SEARCH, params], () => api.getSearch(params), {
    enabled: !isEmpty(params),
    ...options,
  });
};

export const usePaperQuery = (params: string, options?: object) => {
  return useQuery<IPaperDetail>([queryKey.PAPER, params], () => api.getPaperDetail({ doi: params }), {
    select: (data) => {
      const referenceList = data.referenceList.filter((reference) => reference.title);
      return { ...data, referenceList };
    },
    suspense: false,
    useErrorBoundary: true,
    ...options,
  });
};
