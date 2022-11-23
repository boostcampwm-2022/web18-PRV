import styled from 'styled-components';
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
  const handlePageClick = (page: number) => {
    changePage(page);
  };

  const goToPrevPages = () => {
    changePage((Math.ceil(page / 10) - 1) * 10);
  };

  const goToNextPages = () => {
    changePage(Math.ceil(page / 10) * 10 + 1);
  };

  return (
    <>
      {papers.length > 0 ? (
        <>
          <H1>Articles ({pageInfo.totalItems || 0})</H1>
          <Hr />
          <Section>
            <Papers>
              {papers.map((paper, i) => (
                <Paper key={i} data={paper} keyword={keyword} />
              ))}
            </Papers>
            <PageNation>
              {page > 10 && <Button onClick={goToPrevPages}>이전</Button>}
              {Array.from({ length: Math.min(10, pageInfo.totalPages - page + 1) }, (_, i) => {
                const calculatedPage = (Math.ceil(page / 10) - 1) * 10 + i + 1;
                return (
                  <Page key={i} isCurrentPage={page === calculatedPage} onClick={() => handlePageClick(calculatedPage)}>
                    {calculatedPage}
                  </Page>
                );
              })}
              {pageInfo.totalPages > Math.ceil(page / 10) * 10 && <Button onClick={goToNextPages}>다음</Button>}
            </PageNation>
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

const PageNation = styled.div`
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
