import { useEffect, useState } from 'react';
import styled from 'styled-components';
import DropdownIcon from '../../../icons/DropdownIcon';
import DropDownReverseIcon from '../../../icons/DropdownReverseIcon';
import RankingSlide from './RankingSlide';

interface IRankingData {
  keyword: string;
  count: number;
}

const KeywordRanking = () => {
  const [isRankingListOpen, setisRankingListOpen] = useState(false);
  const [rankingData, setRankingData] = useState<IRankingData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();
  const handleButtonClick = () => {
    setisRankingListOpen((prev) => !prev);
  };

  useEffect(() => {
    const fetchKeywordRanking = async () => {
      try {
        const response = await fetch('http://49.50.172.204:4000/keyword-ranking');
        if (!response.ok) {
          throw Error(`Response: ${response.statusText}`);
        }
        const data: IRankingData[] = await response.json();
        setRankingData(data);
        setIsLoading(true);
      } catch (err) {
        let message = 'Unknown Error';
        if (err instanceof Error) message = err.message;
        setError(message);
      }
    };

    fetchKeywordRanking();
  }, []);

  return (
    <RankingContainer>
      {error ? (
        <div>{error}</div>
      ) : (
        <RankingBar>
          <HeaderContainer>
            <span>인기 검색어</span>
            <HeaderDivideLine />
            <RankingContent onClick={handleButtonClick}>
              {isLoading && (rankingData.length ? <RankingSlide rankingData={rankingData} /> : '데이터가 없습니다.')}
            </RankingContent>
            <DropdownReverseButton type="button" onClick={handleButtonClick}>
              {isRankingListOpen ? <DropDownReverseIcon /> : <DropdownIcon />}
            </DropdownReverseButton>
          </HeaderContainer>
          {isRankingListOpen && (
            <>
              <DivideLine />
              <RankingKeywordContainer onClick={handleButtonClick}>
                {rankingData.slice(0, 10).map((data, index) => (
                  <KeywordContainer key={`${index}${data.keyword}`}>
                    <KeywordIndex>{index + 1}</KeywordIndex>
                    <Keyword>{data.keyword}</Keyword>
                  </KeywordContainer>
                ))}
              </RankingKeywordContainer>
            </>
          )}
        </RankingBar>
      )}
      {isRankingListOpen && <Dimmer onClick={handleButtonClick} />}
    </RankingContainer>
  );
};

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
  padding: 5px 20px;
  background-color: ${({ theme }) => theme.COLOR.primary3};
  border: 1px solid ${({ theme }) => theme.COLOR.offWhite};
  border-radius: 20px;
  z-index: 10;
`;

const RankingContent = styled.div`
  display: flex;
  align-items: center;
  width: 300px;
  margin: 0 10px;
  height: 25px;
  cursor: pointer;
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  height: 23px;
  width: 100%;
  ${({ theme }) => theme.TYPO.body_h}
`;

const DropdownReverseButton = styled.button`
  margin-right: 10px;
  background-color: transparent;
  cursor: pointer;
`;

const HeaderDivideLine = styled.hr`
  width: 1px;
  height: 16px;
  margin: 0 10px 0 38px;
`;

const DivideLine = styled.hr`
  width: 100%;
  margin-bottom: 10px;
`;

const RankingKeywordContainer = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 10px;
`;

const KeywordContainer = styled.li`
  display: flex;
  gap: 15px;
  cursor: pointer;
  :hover {
    span:last-of-type {
      ${({ theme }) => theme.TYPO.body_h};
      text-decoration: underline;
    }
  }
`;

const KeywordIndex = styled.span`
  width: 20px;
`;

const Keyword = styled.span`
  ${({ theme }) => theme.TYPO.body1};
`;

const Dimmer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 5;
`;

export default KeywordRanking;
