import { isEmpty } from 'lodash-es';
import styled from 'styled-components';
import Clockicon from '../icons/ClockIcon';

interface RecentKeywordsListProps {
  recentKeywords: string[];
  hoverdIndex: number;
  handleMouseDwon: (prop: string) => void;
  setHoveredIndex: (prop: number) => void;
}

const RecentKeywordsList = ({
  recentKeywords,
  hoverdIndex,
  handleMouseDwon,
  setHoveredIndex,
}: RecentKeywordsListProps) => {
  return (
    <>
      {!isEmpty(recentKeywords) ? (
        recentKeywords.map((keyword, i) => (
          <RecentKeyword
            key={keyword}
            hovered={i === hoverdIndex}
            onMouseOver={() => setHoveredIndex(i)}
            onMouseDown={() => handleMouseDwon(keyword)}
          >
            <Clockicon />
            {keyword}
          </RecentKeyword>
        ))
      ) : (
        <NoneResult>최근 검색어가 없습니다.</NoneResult>
      )}
    </>
  );
};

const RecentKeyword = styled.li<{ hovered: boolean }>`
  display: flex;
  gap: 20px;
  width: 100%;
  padding: 8px 16px;
  color: ${({ theme }) => theme.COLOR.black};
  cursor: pointer;
  background-color: ${({ theme, hovered }) => (hovered ? theme.COLOR.gray1 : 'auto')};
`;

const NoneResult = styled.div`
  padding-top: 25px;
  text-align: center;
`;

export default RecentKeywordsList;
