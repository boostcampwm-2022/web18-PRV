import { IconButton } from '@/components';
import { DropdownIcon, DropdownReverseIcon } from '@/icons';
import { useKeywordRankingQuery } from '@/queries/queries';
import { Ellipsis } from '@/style/styleUtils';
import { createSearchQuery } from '@/utils/createQueryString';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import RankingSlide from './RankingSlide';

const KeywordRanking = () => {
  const [isRankingListOpen, setIsRankingListOpen] = useState(false);
  const { isLoading, data: rankingData } = useKeywordRankingQuery();

  const handleRankingClick = () => {
    setIsRankingListOpen((prev) => !prev);
  };

  return (
    <RankingContainer>
      <RankingBar>
        <HeaderContainer>
          <Title>인기 검색어</Title>
          <HeaderDivideLine />
          <RankingContent onClick={handleRankingClick}>
            {!isLoading && rankingData?.length ? <RankingSlide rankingData={rankingData} /> : '데이터가 없습니다.'}
          </RankingContent>
          <IconButton
            icon={isRankingListOpen ? <DropdownReverseIcon /> : <DropdownIcon />}
            onClick={handleRankingClick}
            aria-label={isRankingListOpen ? '인기검색어 목록 닫기' : '인기검색어 목록 펼치기'}
          />
        </HeaderContainer>
        {isRankingListOpen && (
          <>
            <DivideLine />
            <RankingKeywordContainer>
              {rankingData?.slice(0, 10).map((data, index) => (
                <Link key={data.keyword} to={createSearchQuery(data.keyword)}>
                  <KeywordContainer>
                    <KeywordIndex>{index + 1}</KeywordIndex>
                    <Keyword>{data.keyword}</Keyword>
                  </KeywordContainer>
                </Link>
              ))}
            </RankingKeywordContainer>
          </>
        )}
      </RankingBar>
      {isRankingListOpen && <Dimmer onClick={handleRankingClick} />}
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

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 23px;
  ${({ theme }) => theme.TYPO.body_h}
`;

const Title = styled.span`
  width: 100px;
`;

const HeaderDivideLine = styled.hr`
  width: 1px;
  height: 16px;
`;

const RankingContent = styled.div`
  display: flex;
  align-items: center;
  margin: 0 10px;
  width: 320px;
  height: 25px;
  cursor: pointer;
`;

const DivideLine = styled.hr`
  width: 100%;
  border: 1px solid ${({ theme }) => theme.COLOR.offWhite};
  fill: ${({ theme }) => theme.COLOR.offWhite};
  margin-bottom: 10px;
`;

const RankingKeywordContainer = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 10px;
`;

const KeywordIndex = styled.span`
  width: 20px;
`;

const Keyword = styled(Ellipsis)`
  ${({ theme }) => theme.TYPO.body1};
  display: block;
  width: 100%;
`;

const KeywordContainer = styled.li`
  display: flex;
  width: 100%;
  gap: 15px;
  cursor: pointer;
  :hover {
    ${Keyword} {
      ${({ theme }) => theme.TYPO.body_h};
      text-decoration: underline;
    }
  }
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
