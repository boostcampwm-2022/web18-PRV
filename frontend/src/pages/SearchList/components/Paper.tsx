import styled from 'styled-components';
import { IPaper } from '../SearchList';

interface PaperProps {
  data: IPaper;
  keyword: string;
}

const Paper = ({ data, keyword }: PaperProps) => {
  const { publishedAt, title, authors, citations, references } = data;

  const year = new Date(publishedAt).getFullYear();

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

  return (
    <Container>
      {title && <Title>{highlightKeyword(title)}</Title>}
      {authors && (
        <Content>
          <div>
            <Bold>authors </Bold>
            {highlightKeyword(authors?.join(', '))}
          </div>
        </Content>
      )}
      <Content>
        <div>
          <Bold>published </Bold>
          {year}
        </div>
        <div>
          <Bold>cited by </Bold>
          {citations}
          <Bold> references </Bold>
          {references}
        </div>
      </Content>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Title = styled.div`
  color: ${({ theme }) => theme.COLOR.black};
  ${({ theme }) => theme.TYPO.title}
  cursor: pointer;
  :hover {
    text-decoration: underline;
  }
`;

const Content = styled.div`
  ${({ theme }) => theme.TYPO.body2};
  color: ${({ theme }) => theme.COLOR.gray4};
  display: flex;
  justify-content: space-between;
`;

const Bold = styled.b`
  font-weight: 700;
`;

const Emphasize = styled.span`
  color: #3244ff;
  font-weight: 700;
`;

export default Paper;
