import styled from 'styled-components';
import DropdownReverseIcon from '../../../icons/DropdownReverseIcon';

interface IRankingData {
  keyword: string;
  count: number;
}

interface IRankingListProps {
  rankingData: IRankingData[];
  handleButtonClick: () => void;
}

const RankingList = ({ rankingData, handleButtonClick }: IRankingListProps) => {
  return (
    <>
      <HeaderContainer>
        <span>인기 검색어</span>
        <DropdownReverseButton type="button" onClick={handleButtonClick}>
          <DropdownReverseIcon />
        </DropdownReverseButton>
      </HeaderContainer>
      <DivideLine />
      <RankingContainer>
        {rankingData.map((data, index) => (
          <KeywordContainer key={`${data.keyword}${data.count}`}>
            <span>{index + 1}</span>
            <span>{data.keyword}</span>
          </KeywordContainer>
        ))}
      </RankingContainer>
    </>
  );
};

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

const DivideLine = styled.hr`
  width: 100%;
  margin-bottom: 10px;
`;

const RankingContainer = styled.ul`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 8px;
`;

const KeywordContainer = styled.li`
  display: flex;
  gap: 15px;
`;

export default RankingList;
