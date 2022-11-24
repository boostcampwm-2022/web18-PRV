import styled from 'styled-components';
import usePagination from '../../../customHooks/usePagination';
import { IPageInfo, IPaper } from '../SearchList';
import Paper from './Paper';

const PAGINATION_RANGE = 10;
interface SearchResultsProps {
  pageInfo: IPageInfo;
  papers: IPaper[];
  keyword: string;
  page: number;
  changePage: (page: number) => void;
}

const SearchResults = ({ pageInfo, papers, keyword, page, changePage }: SearchResultsProps) => {
  const { prevLastPage, nextFirstPage, currentPages } = usePagination(page, pageInfo.totalPages, PAGINATION_RANGE);

  const handlePageClick = (page: number) => {
    changePage(page);
  };

  return (
    <>
      {papers.length > 0 ? (
        <>
          <H1>Articles ({pageInfo.totalItems || 0})</H1>
          <Hr />
          <Section>
            <Papers>
              {papers.map((paper) => (
                <Paper key={paper.doi} data={paper} keyword={keyword} />
              ))}
            </Papers>
            <Pagination>
              {page > PAGINATION_RANGE && <Button onClick={() => changePage(prevLastPage)}>이전</Button>}
              {currentPages.map((value) => (
                <Page key={value} isCurrentPage={page === value} onClick={() => handlePageClick(value)}>
                  {value}
                </Page>
              ))}
              {pageInfo.totalPages > Math.ceil(page / PAGINATION_RANGE) * PAGINATION_RANGE && (
                <Button onClick={() => changePage(nextFirstPage)}>다음</Button>
              )}
            </Pagination>
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

const Pagination = styled.div`
  ${({ theme }) => theme.TYPO.body1};
  margin: 20px auto 0 auto;
`;

const Button = styled.button`
  background-color: transparent;
  margin: 0 10px;
  color: ${({ theme }) => theme.COLOR.gray3};
  cursor: pointer;
  :hover {
    color: ${({ theme }) => theme.COLOR.black};
  }
`;

const Page = styled.span<{ isCurrentPage: boolean }>`
  cursor: pointer;
  margin: 0 5px;
  font-weight: ${({ isCurrentPage }) => (isCurrentPage ? 700 : 'auto')};
  :hover {
    text-decoration: underline;
  }
`;

export default SearchResults;
