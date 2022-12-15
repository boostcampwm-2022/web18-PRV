import { IAutoCompletedItem } from '@/api/api';
import { highlightKeyword, removeTag, sliceTitle } from '@/utils/format';
import { Dispatch, SetStateAction, useEffect } from 'react';
import styled from 'styled-components';
interface AutoCompletedListProps {
  autoCompletedItems?: IAutoCompletedItem[];
  keyword: string;
  hoverdIndex: number;
  setHoveredIndex: Dispatch<SetStateAction<number>>;
  handleMouseDown: (doi: string) => void;
}

const AutoCompletedList = ({
  autoCompletedItems = [],
  keyword,
  hoverdIndex,
  setHoveredIndex,
  handleMouseDown,
}: AutoCompletedListProps) => {
  const handleAutoCompletedDown = (index: number) => {
    const doi = autoCompletedItems[index].doi;
    handleMouseDown(doi);
  };

  // 대표 author찾기
  const getRepresentativeAuthor = (authors: string[]) => {
    return (
      authors
        .concat()
        .filter((v, i, arr: string[]) => v.toLowerCase().includes(keyword.toLowerCase()) && arr.splice(i))?.[0] ||
      authors[0]
    );
  };

  useEffect(() => {
    setHoveredIndex(-1);
  }, [setHoveredIndex]);

  return (
    <Container>
      {autoCompletedItems.length > 0 ? (
        autoCompletedItems.map((item, i) => (
          <AutoCompleted
            key={item.doi}
            hovered={i === hoverdIndex}
            onMouseOver={() => setHoveredIndex(i)}
            onMouseDown={() => handleAutoCompletedDown(i)}
          >
            <Title>{highlightKeyword(sliceTitle(removeTag(item.title)), keyword)}</Title>
            {item.authors && (
              <Author>
                authors : {highlightKeyword(getRepresentativeAuthor(item.authors), keyword)}
                {item.authors.length > 1 && <span>외 {item.authors.length - 1}명</span>}
              </Author>
            )}
          </AutoCompleted>
        ))
      ) : (
        <NoResult>자동완성 검색어가 없습니다.</NoResult>
      )}
    </Container>
  );
};

const Container = styled.div`
  overflow-y: auto;
`;

const AutoCompleted = styled.li<{ hovered: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 8px 30px;
  gap: 4px;
  color: ${({ theme }) => theme.COLOR.black};
  cursor: pointer;
  background-color: ${({ theme, hovered }) => (hovered ? theme.COLOR.gray1 : 'auto')};
`;

const Title = styled.div`
  ${({ theme }) => theme.TYPO.body1}
`;

const Author = styled.div`
  ${({ theme }) => theme.TYPO.caption}
  color: ${({ theme }) => theme.COLOR.gray3};
`;

const NoResult = styled.div`
  padding-top: 25px;
  text-align: center;
  overflow: hidden;
`;

export default AutoCompletedList;
