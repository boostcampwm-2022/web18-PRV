import { Suspense, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { IGetSearch } from '../../api/api';
import Footer from '../../components/Footer';
import LoaderWrapper from '../../components/loader/LoaderWrapper';
import theme from '../../style/theme';
import SearchBarHeader from './components/SearchBarHeader';
import SearchResults from './components/SearchResults';

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

  const changePage = (page: number) => {
    const updated = { ...params, page: page.toString() };
    setSearchParams(updated);
  };

  return (
    <Container>
      <SearchBarHeader keyword={params.keyword || ''} />
      <Suspense fallback={<LoaderWrapper />}>
        <SearchResults params={params} changePage={changePage} />
      </Suspense>
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

export default SearchList;
