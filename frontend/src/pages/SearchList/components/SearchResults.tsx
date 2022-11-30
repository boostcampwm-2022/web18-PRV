import { isEmpty } from 'lodash-es';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Api, { IGetSearch } from '../../../api/api';
import MoonLoader from '../../../components/MoonLoader';
import Pagination from '../../../components/Pagination';
import { createDetailQuery } from '../../../utils/createQuery';
import { IPageInfo, IPaper } from '../SearchList';
import Paper from './Paper';

interface SearchResultsProps {
  params: IGetSearch;
  changePage: (page: number) => void;
}

interface IPapersData {
  papers: IPaper[];
  pageInfo: IPageInfo;
}

const api = new Api();

const SearchResults = ({ params, changePage }: SearchResultsProps) => {
  const keyword = params.keyword || '';
  const page = Number(params.page);
  const { data, isLoading } = useQuery<IPapersData>(
    ['papers', params],
    () => api.getSearch(params).then((res) => res.data),
    {
      enabled: !isEmpty(params),
    },
  );

  return (
    <>
      {isLoading ? (
        <MoonWrapper>
          <MoonLoader />
        </MoonWrapper>
      ) : data && data.papers.length > 0 ? (
        <>
          <H1>Articles ({data.pageInfo.totalItems.toLocaleString() || 0})</H1>
          <Hr />
          <Section>
            <Papers>
              {data.papers.map((paper) => (
                <Link key={paper.doi} to={createDetailQuery(paper.doi)}>
                  <Paper data={paper} keyword={keyword} />
                </Link>
              ))}
            </Papers>
            <Pagination activePage={page} onChange={changePage} totalPages={data.pageInfo.totalPages} range={10} />
          </Section>
        </>
      ) : (
        <NoResult>&apos;{keyword}&apos;에 대한 검색 결과가 없습니다.</NoResult>
      )}
    </>
  );
};

const MoonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
`;

const H1 = styled.h1`
  color: ${({ theme }) => theme.COLOR.gray4};
  margin: 16px 30px;
  ${({ theme }) => theme.TYPO.H5}
`;

const Hr = styled.hr`
  border-top: 1px solid ${({ theme }) => theme.COLOR.gray2};
  margin: 0;
`;

const Section = styled.section`
  display: flex;
  flex: 1;
  padding: 20px 30px;
  overflow: auto;
  flex-direction: column;
`;

const Papers = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const NoResult = styled.div`
  flex: 1;
  text-align: center;
  padding-top: 100px;
`;

export default SearchResults;
