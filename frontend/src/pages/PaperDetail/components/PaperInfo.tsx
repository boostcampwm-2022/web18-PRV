import styled from 'styled-components';
import { Ellipsis } from '../../../style/styleUtils';
import { removeTag, sliceTitle } from '../../../utils/format';
import { IPaperDetail } from '../PaperDetail';

interface IProps {
  data: IPaperDetail;
  hoveredNode: string;
  changeHoveredNode: (key: string) => void;
  addChildrensNodes: (doi: string) => void;
}

const DOI_BASE_URL = 'https://doi.org/';

const PaperInfo = ({ data, hoveredNode, changeHoveredNode, addChildrensNodes }: IProps) => {
  const handleMouseOver = (key: string) => {
    changeHoveredNode(key);
  };

  const handleMouseOut = () => {
    changeHoveredNode('');
  };

  return (
    <Container>
      <BasicInfo>
        <Title>{sliceTitle(removeTag(data?.title))}</Title>
        <InfoContainer>
          <InfoItem>
            <h3>{data?.authors?.length > 1 ? 'Authors ' : 'Author '}</h3>
            <InfoAuthor>{data?.authors?.join(', ')}</InfoAuthor>
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
          {data.referenceList.map((reference, i) => (
            <ReferenceItem
              key={i}
              onMouseOver={() => handleMouseOver(reference.key)}
              onMouseOut={() => handleMouseOut()}
              className={`info ${reference.key.toLowerCase() === hoveredNode ? 'hovered' : ''}`}
              onClick={() => reference.doi && addChildrensNodes(reference.doi)}
              disabled={!reference.doi}
            >
              {reference.title && <span>{sliceTitle(removeTag(reference.title))}</span>}
              <ReferenceAuthor>{reference.authors?.join(', ') || 'unknown'}</ReferenceAuthor>
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
`;

const InfoAuthor = styled(Ellipsis)`
  ${({ theme }) => theme.TYPO.body2};
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

const ReferenceItem = styled.li<{ disabled: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 10px;
  cursor: ${({ disabled }) => (disabled ? 'auto' : 'pointer')};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};

  span {
    :first-child {
      ${({ theme }) => theme.TYPO.body2_h};
      line-height: 1.1rem;
    }
  }

  &.hovered {
    color: ${({ theme, disabled }) => (!disabled ? theme.COLOR.secondary2 : undefined)};
  }
`;

const ReferenceAuthor = styled(Ellipsis)`
  ${({ theme }) => theme.TYPO.caption};
`;

export default PaperInfo;
