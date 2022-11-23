import { AxiosError } from 'axios';
import { isEmpty } from 'lodash-es';
import { useQuery } from 'react-query';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import Api from '../../api/api';
import Footer from '../../components/Footer';
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
  doi?: string;
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
  const [searchParams] = useSearchParams();
  const params = Object.fromEntries([...searchParams]);

  const { data, isLoading } = useQuery<IPapersData, AxiosError>(
    ['papers', params],
    () => api.getSearch(params).then((res) => res.data),
    {
      enabled: !isEmpty(params),
    },
  );

  if (isLoading) return <div>로딩즁..</div>;

  return (
    <Container>
      <SearchBarHeader keyword={params.keyword} />
      {data && <SearchResults pageInfo={data.pageInfo} papers={data.papers} keyword={params.keyword} />}
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
