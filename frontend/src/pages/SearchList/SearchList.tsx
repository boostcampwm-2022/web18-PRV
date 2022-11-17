import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchApi from '../../api/searchApi';

const searchApi = new SearchApi();

const SearchList = () => {
  const [data, setData] = useState();

  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (!searchParams) return;

    const params = Object.fromEntries([...searchParams]);
    searchApi.getSearch(params).then(({ data }) => setData(data));
  }, [searchParams]);

  return <div>{data}</div>;
};

export default SearchList;
