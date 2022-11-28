import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Pagination from '../../../components/Pagination';
import { createDetailQuery } from '../../../constants/path';
import { IPageInfo, IPaper } from '../SearchList';
import Paper from './Paper';

interface SearchResultsProps {
  pageInfo: IPageInfo;
  papers: IPaper[];
  keyword: string;
  page: number;
  changePage: (page: number) => void;
}

const SearchResults = ({ pageInfo, papers, keyword, page, changePage }: SearchResultsProps) => {
  return (
    <>
      {papers.length > 0 ? (
        <>
          <H1>Articles ({pageInfo.totalItems.toLocaleString() || 0})</H1>
          <Hr />
          <Section>
            <Papers>
              {papers.map((paper) => (
                <Link key={paper.doi} to={createDetailQuery(paper.doi)}>
                  <Paper data={paper} keyword={keyword} />
                </Link>
              ))}
            </Papers>
            <Pagination activePage={page} onChange={changePage} totalPages={pageInfo.totalPages} range={10} />
          </Section>
        </>
      ) : (
        <NoResult>&apos;{keyword}&apos;에 대한 검색 결과가 없습니다.</NoResult>
      )}
    </>
  );
};

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
