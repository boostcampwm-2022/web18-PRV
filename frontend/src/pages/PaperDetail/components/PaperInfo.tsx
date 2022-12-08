import styled from 'styled-components';
import { MAX_TITLE_LENGTH } from '../../../constants/main';
import { removeTag } from '../../../utils/format';
import { IPaperDetail } from '../PaperDetail';

interface IProps {
  data: IPaperDetail;
  hoveredNode: string;
  changeHoveredNode: (key: string) => void;
}

const DOI_BASE_URL = 'https://doi.org/';

const PaperInfo = ({ data, hoveredNode, changeHoveredNode }: IProps) => {
  const handleMouseOver = (key: string) => {
    changeHoveredNode(key);
  };

  const handleMouseOut = () => {
    changeHoveredNode('');
  };

  const sliceTitle = (title: string) => {
    return title.length > MAX_TITLE_LENGTH ? `${title.slice(0, MAX_TITLE_LENGTH)}...` : title;
  };

  return (
    <Container>
      <BasicInfo>
        <Title>{sliceTitle(removeTag(data?.title))}</Title>
        <InfoContainer>
          <InfoItem>
            <h3>{data?.authors.length > 1 ? 'Authors ' : 'Author '}</h3>
            <span>{data?.authors?.join(', ')}</span>
          </InfoItem>
          <InfoItem>
            <h3>DOI</h3>
            <a href={DOI_BASE_URL + data?.doi} target="_blank" rel="noopener noreferrer">
              {data?.doi}
            </a>
          </InfoItem>
        </InfoContainer>
        <DivideLine />
      </BasicInfo>
      <References>
        <h3>References ({data.referenceList.length})</h3>
        <ReferenceContainer>
          {data.referenceList.map((reference) => (
            <ReferenceItem
              key={reference.key}
              onMouseOver={() => handleMouseOver(reference.key)}
              onMouseOut={() => handleMouseOut()}
              className={`info ${reference.key === hoveredNode ? 'hovered' : ''}`}
            >
              <span>{reference.title}</span>
              <span>{reference.authors?.join(', ') || 'unknown'}</span>
            </ReferenceItem>
          ))}
        </ReferenceContainer>
      </References>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 300px;
  padding: 10px;
  color: ${({ theme }) => theme.COLOR.offWhite};
  background-color: ${({ theme }) => theme.COLOR.primary3};
`;

const BasicInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 50px;
  padding: 0 15px;
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Title = styled.h2`
  ${({ theme }) => theme.TYPO.title};
  font-weight: 700;
  line-height: 1.3rem;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  h3 {
    ${({ theme }) => theme.TYPO.body_h};
  }
  a {
    ${({ theme }) => theme.TYPO.body2};
    :hover {
      text-decoration: underline;
    }
  }
  span {
    ${({ theme }) => theme.TYPO.body2};
    white-space: normal;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    word-break: keep-all;
  }
`;

const DivideLine = styled.hr`
  width: 100%;
  border: 0.5px solid ${({ theme }) => theme.COLOR.gray2};
`;

const References = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow: scroll;
  h3 {
    ${({ theme }) => theme.TYPO.body_h};
    padding: 0 15px;
  }
`;

const ReferenceContainer = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 0 15px;
`;

const ReferenceItem = styled.li`
  display: flex;
  flex-direction: column;
  gap: 10px;
  cursor: pointer;

  span {
    :first-child {
      ${({ theme }) => theme.TYPO.body2_h};
      line-height: 1.1rem;
    }
    :last-child {
      ${({ theme }) => theme.TYPO.caption};
    }
  }

  &.hovered {
    color: ${({ theme }) => theme.COLOR.secondary2};
  }
`;

export default PaperInfo;
