import { AxiosError } from 'axios';
import { isEmpty } from 'lodash-es';
import { useMemo } from 'react';
import { useQuery } from 'react-query';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import Api, { IGetSearch } from '../../api/api';
import Footer from '../../components/Footer';
import MoonLoader from '../../components/MoonLoader';
import theme from '../../style/theme';
import SearchBarHeader from './components/SearchBarHeader';
import SearchResults from './components/SearchResults';

const api = new Api();

export interface IPaper {
  title: string;
  authors: string[];
  publishedAt: string;
  citations: number;
  references: number;
  doi: string;
}

export interface IPageInfo {
  totalItems: number;
  totalPages: number;
}
interface IPapersData {
  papers: IPaper[];
  pageInfo: IPageInfo;
}

const SearchList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = useMemo<IGetSearch>(() => {
    const paramNames = ['page', 'keyword', 'rows'];
    return paramNames.reduce(
      (prev, curr) => (searchParams.get(curr) ? { ...prev, [curr]: searchParams.get(curr) } : prev),
      {
        page: '1',
        keyword: '',
      },
    );
  }, [searchParams]);

  const { data, isLoading } = useQuery<IPapersData, AxiosError>(
    ['papers', params],
    () => api.getSearch(params).then((res) => res.data),
    {
      enabled: !isEmpty(params),
    },
  );

  const changePage = (page: number) => {
    const updated = { ...params, page: page.toString() };
    setSearchParams(updated);
  };

  return (
    <Container>
      <SearchBarHeader keyword={params.keyword || ''} />
      {isLoading ? (
        <MoonWrapper>
          <MoonLoader />
        </MoonWrapper>
      ) : data ? (
        <SearchResults
          pageInfo={data.pageInfo}
          papers={data.papers}
          keyword={params.keyword || ''}
          page={Number(params.page)}
          changePage={changePage}
        />
      ) : (
        <></>
      )}
      <Footer bgColor={theme.COLOR.primary3} contentColor={theme.COLOR.offWhite} />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: ${({ theme }) => theme.COLOR.offWhite};
`;

const MoonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
`;

export default SearchList;
