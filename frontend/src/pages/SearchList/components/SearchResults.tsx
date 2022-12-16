import { IGetSearch } from '@/api/api';
import { IconButton, Pagination } from '@/components';
import InfoIcon from '@/icons/InfoIcon';
import { useSearchQuery } from '@/queries/queries';
import theme from '@/style/theme';
import { createDetailQuery } from '@/utils/createQueryString';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Paper from './Paper';

interface SearchResultsProps {
  params: IGetSearch;
  changePage: (page: number) => void;
}

const SearchResults = ({ params, changePage }: SearchResultsProps) => {
  const [isTooltipOpened, setIsTooltipOpened] = useState(false);
  const keyword = params.keyword || '';
  const page = Number(params.page);
  const { data } = useSearchQuery(params);

  const handleMouseOver = () => {
    setIsTooltipOpened(true);
  };

  const handleMouseOut = () => {
    setIsTooltipOpened(false);
  };

  return data && data.papers.length > 0 ? (
    <>
      <SectionHeader>
        <H1>Articles ({data.pageInfo.totalItems.toLocaleString() || 0})</H1>
        <IconButtonWrapper onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
          <IconButton icon={<InfoIcon color={theme.COLOR.gray3} />} aria-label="정보" />
        </IconButtonWrapper>
        {isTooltipOpened && <InfoTooltip>논문의 정보가 정확하지 않거나 누락되어 있을 수 있습니다.</InfoTooltip>}
      </SectionHeader>
      <Hr />
      <Section>
        <Papers>
          {data.papers.map((paper) => (
            <Link key={paper.doi} to={createDetailQuery(paper.doi)} state={{ hasPrevPage: true }}>
              <Paper data={paper} keyword={keyword} />
            </Link>
          ))}
        </Papers>
        <Pagination activePage={page} onChange={changePage} totalPages={data.pageInfo.totalPages} range={10} />
      </Section>
    </>
  ) : (
    <NoResult>&apos;{keyword}&apos;에 대한 검색 결과가 없습니다.</NoResult>
  );
};

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
`;

const H1 = styled.h1`
  color: ${({ theme }) => theme.COLOR.gray4};
  margin: 16px 15px 16px 30px;
  ${({ theme }) => theme.TYPO.H5}
`;

const IconButtonWrapper = styled.div`
  opacity: 0.5;
  cursor: pointer;
  z-index: 2;
  :hover {
    opacity: 1;
  }
`;

const InfoTooltip = styled.span`
  ${({ theme }) => theme.TYPO.body1};
  font-weight: 700;
  padding: 5px 8px;
  margin-left: 10px;
  color: ${({ theme }) => theme.COLOR.gray4};
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
