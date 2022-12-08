import styled from 'styled-components';
import { Ellipsis } from '../../../style/styleUtils';
import { highlightKeyword, removeTag, sliceTitle } from '../../../utils/format';
import { IPaper } from '../SearchList';

interface PaperProps {
  data: IPaper;
  keyword: string;
}

const Paper = ({ data, keyword }: PaperProps) => {
  const { publishedAt, title, authors, citations, references } = data;

  const year = new Date(publishedAt).getFullYear();

  return (
    <Container>
      {title && <Title>{highlightKeyword(sliceTitle(removeTag(title)), keyword)}</Title>}
      {authors && (
        <Content>
          <div>
            <Bold>{authors.length > 1 ? 'Authors ' : 'Author '}</Bold>
            <Ellipsis>{highlightKeyword(authors?.join(', '), keyword)}</Ellipsis>
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
`;

const Bold = styled.b`
  font-weight: 700;
`;

export default Paper;
