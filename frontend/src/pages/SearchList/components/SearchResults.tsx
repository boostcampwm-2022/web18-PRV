import styled from 'styled-components';
import { IPageInfo, IPaper } from '../SearchList';
import Paper from './Paper';

interface SearchResultsProps {
  pageInfo: IPageInfo;
  papers: IPaper[];
  keyword: string;
}

const SearchResults = ({ pageInfo, papers, keyword }: SearchResultsProps) => {
  return (
    <Container>
      {papers.length > 0 ? (
        <>
          <H1>Articles ({pageInfo.totalItems || 0})</H1>
          <Hr />
          <Papers>
            {papers.map((paper, i) => (
              <Paper key={i} data={paper} keyword={keyword} />
            ))}
          </Papers>
        </>
      ) : (
        <NoResult>&apos;{keyword}&apos;에 대한 검색 결과가 없습니다.</NoResult>
      )}
    </Container>
  );
};

const Container = styled.main`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  overflow-y: auto;
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

const Papers = styled.section`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 20px 30px;
  gap: 30px;
  overflow: auto;
`;

const NoResult = styled.div`
  text-align: center;
`;

export default SearchResults;
