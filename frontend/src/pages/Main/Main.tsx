import styled from 'styled-components';
import Footer from '../../components/Footer';
import Search from '../../components/search/Search';
import ErrorBoundary from '../../error/ErrorBoundary';
import RankingErrorFallback from '../../error/RankingErrorFallback';
import LogoIcon from '../../icons/LogoIcon';
import KeywordRanking from './components/KeywordRanking';
import StarLayer from './components/StarLayer';

const Main = () => {
  return (
    <Container>
      <StarLayer />
      <MainContainer>
        <TitleContainer>
          <LogoIcon />
          <Title>PRV</Title>
        </TitleContainer>
        <ContentContainer>
          <div>Paper Reference Visualization</div>
          <div>논문 간 인용관계 시각화 솔루션</div>
          <div>This website renders reference relation of paper</div>
        </ContentContainer>
        <ErrorBoundary fallback={RankingErrorFallback}>
          <KeywordRanking />
        </ErrorBoundary>
        <Search />
      </MainContainer>
      <Positioner>
        <Footer />
      </Positioner>
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

const Positioner = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
`;

export default Main;
