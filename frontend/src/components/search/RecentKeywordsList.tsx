import { isEmpty } from 'lodash-es';
import { Dispatch, SetStateAction, useEffect } from 'react';
import styled from 'styled-components';
import Clockicon from '../../icons/ClockIcon';

interface RecentKeywordsListProps {
  recentKeywords: string[];
  hoverdIndex: number;
  handleMouseDown: (prop: string) => void;
  setHoveredIndex: Dispatch<SetStateAction<number>>;
}

const RecentKeywordsList = ({
  recentKeywords,
  hoverdIndex,
  handleMouseDown,
  setHoveredIndex,
}: RecentKeywordsListProps) => {
  useEffect(() => {
    setHoveredIndex(-1);
  }, [setHoveredIndex]);

  return (
    <Container>
      {!isEmpty(recentKeywords) ? (
        recentKeywords.map((keyword, i) => (
          <Keyword
            key={keyword}
            hovered={i === hoverdIndex}
            onMouseOver={() => setHoveredIndex(i)}
            onMouseDown={() => handleMouseDown(keyword)}
          >
            <Clockicon />
            {keyword}
          </Keyword>
        ))
      ) : (
        <NoResult>최근 검색어가 없습니다.</NoResult>
      )}
    </Container>
  );
};

const Container = styled.div`
  overflow-y: auto;
`;

const Keyword = styled.li<{ hovered: boolean }>`
  display: flex;
  gap: 20px;
  width: 100%;
  padding: 8px 16px;
  color: ${({ theme }) => theme.COLOR.black};
  cursor: pointer;
  background-color: ${({ theme, hovered }) => (hovered ? theme.COLOR.gray1 : 'auto')};
`;

const NoResult = styled.div`
  padding-top: 25px;
  text-align: center;
  overflow: hidden;
`;

export default RecentKeywordsList;