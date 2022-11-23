import { AxiosError } from 'axios';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { createSearchParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Api from '../../../api/api';
import { PATH_SEARCH_LIST } from '../../../constants/path';
import DropdownIcon from '../../../icons/DropdownIcon';
import DropDownReverseIcon from '../../../icons/DropdownReverseIcon';
import RankingSlide from './RankingSlide';

interface IRankingData {
  keyword: string;
  count: number;
}

const api = new Api();

const KeywordRanking = () => {
  const [isRankingListOpen, setIsRankingListOpen] = useState(false);
  const navigate = useNavigate();
  const {
    isLoading,
    isError,
    data: rankingData,
  } = useQuery<IRankingData[], AxiosError>('getKeywordRanking', () => api.getKeywordRanking().then((res) => res.data), {
    retry: 3,
  });

  const goToSearchList = (keyword: string) => {
    const params = { keyword, page: '1', rows: '20' };
    navigate({
      pathname: PATH_SEARCH_LIST,
      search: createSearchParams(params).toString(),
    });
  };

  const handleRankingClick = () => {
    setIsRankingListOpen((prev) => !prev);
  };

  const handleKeywordClick = (keyword: string) => {
    goToSearchList(keyword);
  };

  return (
    <RankingContainer>
      {isError ? (
        <ErrorMessage>오류 발생으로 인기검색어 사용이 불가합니다.</ErrorMessage>
      ) : (
        <RankingBar>
          <HeaderContainer>
            <span>인기 검색어</span>
            <HeaderDivideLine />
            <RankingContent onClick={handleRankingClick}>
              {!isLoading && (rankingData?.length ? <RankingSlide rankingData={rankingData} /> : '데이터가 없습니다.')}
            </RankingContent>
            <DropdownReverseButton type="button" onClick={handleRankingClick}>
              {isRankingListOpen ? <DropDownReverseIcon /> : <DropdownIcon />}
            </DropdownReverseButton>
          </HeaderContainer>
          {isRankingListOpen && (
            <>
              <DivideLine />
              <RankingKeywordContainer>
                {rankingData?.slice(0, 10).map((data, index) => (
                  <KeywordContainer key={`${index}${data.keyword}`} onClick={() => handleKeywordClick(data.keyword)}>
                    <KeywordIndex>{index + 1}</KeywordIndex>
                    <Keyword>{data.keyword}</Keyword>
                  </KeywordContainer>
                ))}
              </RankingKeywordContainer>
            </>
          )}
        </RankingBar>
      )}
      {isRankingListOpen && <Dimmer onClick={handleRankingClick} />}
    </RankingContainer>
  );
};

const RankingContainer = styled.div`
  position: relative;
  width: 500px;
  height: 70px;
`;

const ErrorMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
  padding: 5px 20px;
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
  flex-grow: 1;
  align-items: center;
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
