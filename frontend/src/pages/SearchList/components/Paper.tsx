import styled from 'styled-components';
import { MAX_TITLE_LENGTH } from '../../../constants/main';
import { removeHtml } from '../../../utils/format';
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

  const sliceTitle = (title: string) => {
    return title.length > MAX_TITLE_LENGTH ? `${title.slice(0, MAX_TITLE_LENGTH)}...` : title;
  };

  return (
    <Container>
      {title && <Title>{highlightKeyword(sliceTitle(removeHtml(title)))}</Title>}
      {authors && (
        <Content>
          <div>
            <Bold>{authors.length > 1 ? 'Authors ' : 'Author '}</Bold>
            <span>{highlightKeyword(authors?.join(', '))}</span>
          </div>
        </Content>
      )}
      <Content>
        <div>
          <Bold>Published </Bold>
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
  > div > span {
    white-space: normal;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    word-break: keep-all;
  }
`;

const Bold = styled.b`
  font-weight: 700;
`;

const Emphasize = styled.span`
  color: #3244ff;
  font-weight: 700;
`;

export default Paper;
