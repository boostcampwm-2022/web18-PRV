import { Dispatch, SetStateAction, useEffect } from 'react';
import styled from 'styled-components';
import { IAutoCompletedItem } from './Search';

interface AutoCompletedListProps {
  autoCompletedItems?: IAutoCompletedItem[];
  keyword: string;
  hoverdIndex: number;
  setHoveredIndex: Dispatch<SetStateAction<number>>;
}

const AutoCompletedList = ({
  autoCompletedItems = [],
  keyword,
  hoverdIndex,
  setHoveredIndex,
}: AutoCompletedListProps) => {
  const handleAutoCompletedDown = (index: number) => {
    // Todo : 상세정보 api 호출
    console.log('상세정보', autoCompletedItems[index].doi);
  };

  // keyword 강조
  const highlightKeyword = (text: string) => {
    const rawKeywordList = keyword.trim().toLowerCase().split(/\s/gi);

    return rawKeywordList.length > 0 && rawKeywordList.some((rawKeyword) => text.toLowerCase().includes(rawKeyword))
      ? text
          .split(new RegExp(`(${rawKeywordList.join('|')})`, 'gi'))
          .map((part, i) =>
            rawKeywordList.some((keywordPart) => part.trim().toLowerCase() === keywordPart) ? (
              <Emphasize key={i}>{part}</Emphasize>
            ) : (
              part
            ),
          )
      : text;
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
            <Title>{highlightKeyword(item.title)}</Title>
            {item.authors && (
              <Author>
                authors : {highlightKeyword(getRepresentativeAuthor(item.authors))}
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

const Emphasize = styled.span`
  color: #3244ff;
  font-weight: 700;
`;

const NoResult = styled.div`
  padding-top: 25px;
  text-align: center;
  overflow: hidden;
`;

export default AutoCompletedList;
