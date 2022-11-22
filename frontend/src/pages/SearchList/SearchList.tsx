import { isEmpty } from 'lodash-es';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import Api from '../../api/api';
import Footer from '../../components/Footer';
import theme from '../../style/theme';
import SearchBarHeader from './components/SearchBarHeader';

const api = new Api();

interface Paper {
  title: string;
  authors: [
    {
      given?: string;
      family?: string;
      name?: string;
    },
  ];
  publishedAt: string;
  citations: number;
  references: number;
  doi?: string;
}

interface PageInfo {
  totalItems: number;
  totalPages: number;
}

interface IPapersData {
  papers: Paper[];
  pageInfo: PageInfo;
}

const SearchList = () => {
  const [searchParams] = useSearchParams();
  const [pageInfo, setPageInfo] = useState<PageInfo>();
  const [papers, setPapers] = useState<Paper[]>();
  const params = Object.fromEntries([...searchParams]);

  const { isLoading } = useQuery(['papers', params], () => api.getSearch(params).then((res) => res.data), {
    enabled: !isEmpty(params),
    onSuccess: (data: IPapersData) => {
      console.log(data);
      setPageInfo(data.pageInfo);
      setPapers(data.papers);
    },
  });

  if (isLoading) return <div>로딩즁..</div>;

  return (
    <Container>
      <SearchBarHeader keyword={params.keyword} />
      <Results></Results>
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

const Results = styled.main`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  overflow-y: auto;
`;

export default SearchList;
