import styled from 'styled-components';
import PrvFooter from '../../components/PrvFooter';
import PrvLogo from '../../components/PrvLogo';
import PrvSearch from '../../components/PrvSearch';
import { SUBTITLE, TITLE, TITLE_KOREAN } from '../../constants/main';
import Popular from './components/TopSearched';

const Main = () => {
  return (
    <Container>
      <MainContainer>
        <TitleContainer>
          <PrvLogo />
          <Title>PRV</Title>
        </TitleContainer>
        <ContentContainer>
          <div>{TITLE}</div>
          <div>{TITLE_KOREAN}</div>
          <div>{SUBTITLE}</div>
        </ContentContainer>
        <Popular />
        <PrvSearch />
      </MainContainer>
      <PrvFooter />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  background-color: ${({ theme }) => theme.COLOR.primary3};
  color: ${({ theme }) => theme.COLOR.offWhite};
`;

const MainContainer = styled.main`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  height: 100%;
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Title = styled.div`
  ${({ theme }) => theme.TYPO.H4};
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  ${({ theme }) => theme.TYPO.body2};
`;

export default Main;
