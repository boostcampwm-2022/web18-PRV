import { isEmpty } from 'lodash-es';
import { useEffect } from 'react';
import styled from 'styled-components';
import { IAutoCompletedData } from './Search';

interface AutoCompletedListProps {
  autoCompletedDatas: IAutoCompletedData[];
  keyword: string;
  hoverdIndex: number;
  setHoveredIndex: (prop: number) => void;
}

const AutoCompletedList = ({ autoCompletedDatas, keyword, hoverdIndex, setHoveredIndex }: AutoCompletedListProps) => {
  const handleAutoCompletedDown = (index: number) => {
    // Todo : 상세정보 api 호출
    console.log('상세정보', autoCompletedDatas[index].doi);
  };

  // keyword 강조
  const highlightKeyword = (text: string) => {
    const rawKeyword = keyword.trim().toLowerCase();
    return rawKeyword !== '' && text.toLowerCase().includes(rawKeyword)
      ? text
          .split(new RegExp(`(${rawKeyword})`, 'gi'))
          .map((part, i) => (part.trim().toLowerCase() === rawKeyword ? <Emphasize key={i}>{part}</Emphasize> : part))
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
      {!isEmpty(autoCompletedDatas) ? (
        autoCompletedDatas.map((data, i) => (
          <AutoCompleted
            key={data.doi}
            hovered={i === hoverdIndex}
            onMouseOver={() => setHoveredIndex(i)}
            onMouseDown={() => handleAutoCompletedDown(i)}
          >
            <Title>{highlightKeyword(data.title)}</Title>
            {data.authors && (
              <Author>
                authors : {highlightKeyword(getRepresentativeAuthor(data.authors))}
                {data.authors.length > 1 && <span>외 {data.authors.length - 1}명</span>}
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
