import { isEmpty } from 'lodash-es';
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
    if (keyword !== '' && text.toLocaleLowerCase().includes(keyword.trim().toLocaleLowerCase())) {
      const parts = text.split(new RegExp(`(${keyword.trim()})`, 'gi'));
      return (
        <>
          {parts.map((part, index) =>
            part.trim().toLowerCase() === keyword.trim().toLowerCase() ? (
              <Emphasize key={index}>{part}</Emphasize>
            ) : (
              part
            ),
          )}
        </>
      );
    }
    return text;
  };

  // keyword와 매치되는 첫번째 author 찾기
  const findMatchedAuthor = (authors: string[]) => {
    return authors
      .concat()
      .filter((v, i, arr: string[]) => v.toLowerCase().includes(keyword.toLowerCase()) && arr.splice(i))[0];
  };

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
                authors :{' '}
                {data.authors.every((author) => !author.toLowerCase().includes(keyword.toLowerCase()))
                  ? data.authors[0]
                  : highlightKeyword(findMatchedAuthor(data.authors))}
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
