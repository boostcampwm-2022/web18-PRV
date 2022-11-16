import qs from 'qs';
import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import SearchApi, { IGetSearch } from '../../api/searchApi';

const searchApi = new SearchApi();

const SearchList = () => {
  const location = useLocation();
  const [data, setData] = useState();

  // url의 query string을 파싱
  const params = useMemo(
    () =>
      qs.parse(location.search, {
        ignoreQueryPrefix: true,
      }) as IGetSearch,
    [location.search],
  );

  useEffect(() => {
    if (params) searchApi.getSearch(params).then(({ data }) => setData(data));
  }, [params]);

  return <div>{data}</div>;
};

export default SearchList;
