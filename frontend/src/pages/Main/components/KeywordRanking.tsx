import { useEffect, useState } from 'react';
import styled from 'styled-components';
import DropdownIcon from '../../../icons/DropdownIcon';
import DropDownReverseIcon from '../../../icons/DropdownReverseIcon';

interface IRankingData {
  keyword: string;
  count: number;
}

const KeywordRanking = () => {
  const [isRankingListOpen, setisRankingListOpen] = useState(false);
  const [rankingData, setRankingData] = useState<IRankingData[]>([]);
  const handleButtonClick = () => {
    setisRankingListOpen((prev) => !prev);
  };

  useEffect(() => {
    const fetchKeywordRanking = async () => {
      const response = await fetch('/data/keywordRanking.json');
      const data: IRankingData[] = await response.json();
      setRankingData(data);
    };

    fetchKeywordRanking();
  }, []);

  return (
    <RankingContainer>
      <RankingBar>
        <HeaderContainer>
          <span>인기 검색어</span>
          {isRankingListOpen || (
            <>
              <HeaderDivideLine />
              <RankingContent>
                <Slide>
                  {rankingData.length && (
                    <>
                      <span>1</span>
                      <span>{rankingData[0].keyword}</span>
                    </>
                  )}
                </Slide>
              </RankingContent>
            </>
          )}
          <DropdownReverseButton type="button" onClick={handleButtonClick}>
            {isRankingListOpen ? <DropDownReverseIcon /> : <DropdownIcon />}
          </DropdownReverseButton>
        </HeaderContainer>
        {isRankingListOpen && (
          <>
            <DivideLine />
            <RankingKeywordContainer>
              {rankingData.map((data, index) => (
                <KeywordContainer key={`${index}${data.keyword}`}>
                  <span>{index + 1}</span>
                  <span>{data.keyword}</span>
                </KeywordContainer>
              ))}
            </RankingKeywordContainer>
          </>
        )}
      </RankingBar>
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
  padding: 10px 20px;
  background-color: ${({ theme }) => theme.COLOR.primary3};
  border: 1px solid ${({ theme }) => theme.COLOR.offWhite};
  border-radius: 20px;
  z-index: 10;
`;

const RankingContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-grow: 1;
  margin: 0 10px;
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
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

const Slide = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;

  span:last-of-type {
    ${({ theme }) => theme.TYPO.body1}
  }
`;

const RankingKeywordContainer = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const KeywordContainer = styled.li`
  display: flex;
  gap: 15px;
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
