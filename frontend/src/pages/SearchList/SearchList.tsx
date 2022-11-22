import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Api from '../../api/api';

const api = new Api();

const SearchList = () => {
  const [data, setData] = useState();

  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (!searchParams) return;

    const params = Object.fromEntries([...searchParams]);
    api.getSearch(params).then(({ data }) => setData(data));
  }, [searchParams]);

  return <div>{data}</div>;
};

export default SearchList;
