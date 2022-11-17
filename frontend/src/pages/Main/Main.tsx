import styled from 'styled-components';
import Footer from '../../components/Footer';
import Search from '../../components/Search';
import { SUBTITLE, TITLE, TITLE_KOREAN } from '../../constants/main';
import LogoIcon from '../../icons/LogoIcon';
import KeywordRanking from './components/KeywordRanking';

const Main = () => {
  return (
    <Container>
      <MainContainer>
        <TitleContainer>
          <LogoIcon />
          <Title>PRV</Title>
        </TitleContainer>
        <ContentContainer>
          <div>{TITLE}</div>
          <div>{TITLE_KOREAN}</div>
          <div>{SUBTITLE}</div>
        </ContentContainer>
        <KeywordRanking />
        <Search />
      </MainContainer>
      <Footer />
    </Container>
  );
};

const Container = styled.div`
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
  margin-top: 150px;
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
