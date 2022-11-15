import { useEffect, useState } from 'react';
import styled from 'styled-components';
import PrvFooter from '../../components/PrvFooter';
import PrvLogo from '../../components/PrvLogo';
import PrvSearch from '../../components/PrvSearch';
import { SUBTITLE, TITLE, TITLE_KOREAN } from '../../constants/main';
import RankingList from './components/RankingList';
import RankingSlide from './components/RankingSlide';

interface IRankingData {
  keyword: string;
  count: number;
}

const Main = () => {
  const [isRankingListOpen, setisRankingListOpen] = useState(false);
  const [rankingData, setRankingData] = useState<IRankingData[]>([]);
  const openRankingList = () => {
    setisRankingListOpen(true);
  };
  const closeRankingList = () => {
    setisRankingListOpen(false);
  };

  useEffect(() => {
    const fetchKeywordRanking = async () => {
      const response = await fetch('/data/keywordRanking.json');
      const data: IRankingData[] = await response.json();
      console.log(data);
      setRankingData(data);
    };

    fetchKeywordRanking();
  }, []);

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
        <RankingContainer>
          <RankingBar>
            {isRankingListOpen ? (
              <RankingList rankingData={rankingData} handleButtonClick={closeRankingList} />
            ) : (
              <RankingSlide rankingData={rankingData} handleButtonClick={openRankingList} />
            )}
          </RankingBar>
        </RankingContainer>
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

const RankingContainer = styled.div`
  position: relative;
  width: 500px;
  height: 70px;
`;

const RankingBar = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: absolute;
  width: 100%;
  margin-top: 30px;
  padding: 10px 20px;
  background-color: ${({ theme }) => theme.COLOR.primary3};
  border: 1px solid ${({ theme }) => theme.COLOR.offWhite};
  border-radius: 20px;
  z-index: 10;
`;

export default Main;
