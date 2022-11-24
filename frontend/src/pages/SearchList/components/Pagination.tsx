import { useMemo } from 'react';
import styled from 'styled-components';

interface PaginationProps {
  prevText: string;
  nextText: string;
  activePage: number;
  totalPages: number;
  range: number;
  onChange: (page: number) => void;
}

const Pagination = ({ prevText, nextText, activePage, totalPages, range, onChange }: PaginationProps) => {
  const pageItems = useMemo(
    () =>
      Array.from(
        { length: Math.min(range, totalPages - (Math.ceil(activePage / range) - 1) * range) },
        (_, i) => (Math.ceil(activePage / range) - 1) * range + i + 1,
      ),
    [activePage, range, totalPages],
  );

  const isPrevButtonExist = activePage > range;
  const isNextButtonExist = totalPages > Math.ceil(activePage / range) * range;

  const goToPrevRangeLastPage = () => {
    onChange((Math.ceil(activePage / range) - 1) * range);
  };

  const goToNextRangeFirstPage = () => {
    onChange(Math.ceil(activePage / range) * range + 1);
  };

  return (
    <Container>
      {isPrevButtonExist && <Button onClick={goToPrevRangeLastPage}>{prevText}</Button>}
      {pageItems.map((page) => (
        <Page key={page} isCurrentPage={activePage === page} onClick={() => onChange(page)}>
          {page}
        </Page>
      ))}
      {isNextButtonExist && <Button onClick={goToNextRangeFirstPage}>{nextText}</Button>}
    </Container>
  );
};

const Container = styled.div`
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

export default Pagination;
