import { IconButton } from '@/components';
import { ClockIcon, XIcon } from '@/icons';
import { setLocalStorage } from '@/utils/storage';
import { isEmpty } from 'lodash-es';
import { Dispatch, SetStateAction, useEffect } from 'react';
import styled from 'styled-components';

interface RecentKeywordsListProps {
  recentKeywords: string[];
  hoverdIndex: number;
  handleMouseDown: (prop: string) => void;
  setHoveredIndex: Dispatch<SetStateAction<number>>;
  initializeRecentKeywords: () => void;
}

const RecentKeywordsList = ({
  recentKeywords,
  hoverdIndex,
  handleMouseDown,
  setHoveredIndex,
  initializeRecentKeywords,
}: RecentKeywordsListProps) => {
  const handleRecentKeywordRemove = (e: React.MouseEvent, keyword: string) => {
    e.preventDefault();
    e.stopPropagation();
    setLocalStorage('recentKeywords', Array.from([...recentKeywords.filter((v) => v !== keyword)]));
    initializeRecentKeywords();
  };

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
            <ClockIcon />
            {keyword}
            <DeleteButton
              icon={<XIcon />}
              onMouseDown={(e) => handleRecentKeywordRemove(e, keyword)}
              aria-label="삭제"
            />
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

const DeleteButton = styled(IconButton)`
  margin-left: auto;
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  :hover {
    background-color: ${({ theme }) => theme.COLOR.offWhite};
    border-radius: 50%;
  }
`;

export default RecentKeywordsList;
