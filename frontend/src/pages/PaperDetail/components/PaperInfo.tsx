import styled from 'styled-components';
import { IPaperDetail } from '../PaperDetail';

interface IProps {
  data: IPaperDetail;
}

const DOI_BASE_URL = 'https://doi.org/';

const PaperInfo = ({ data }: IProps) => {
  return (
    <Container>
      <BasicInfo>
        <Title>{data?.title}</Title>
        <InfoContainer>
          <InfoItem>
            <h3>Authors</h3>
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
        <h3>References ({data.references})</h3>
        <ReferenceContainer>
          {data.referenceList.map(
            (reference, index) =>
              // TODO: 임시로 key에 index 사용 중. 서버에서 key로 사용할 데이터 전송 예정.
              reference.title && (
                <ReferenceItem key={index}>
                  <span>{reference.title}</span>
                  <span>{reference.authors.join(', ')}</span>
                </ReferenceItem>
              ),
          )}
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

  span {
    :first-child {
      ${({ theme }) => theme.TYPO.body2_h};
      line-height: 1.1rem;
    }
    :last-child {
      ${({ theme }) => theme.TYPO.caption};
    }
  }
`;

export default PaperInfo;
