import styled from 'styled-components';
import DropdownIcon from '../../../icons/DropdownIcon';

interface IRankingData {
  keyword: string;
  count: number;
}

interface RankingSlideProps {
  rankingData: IRankingData[];
  handleButtonClick: () => void;
}

const RankingSlide = ({ rankingData, handleButtonClick }: RankingSlideProps) => {
  return (
    <Container>
      <span>인기 검색어</span>
      <DivideLine />
      <RankingContent>
        <Slide>
          <span>1</span>
          <span>{rankingData[0].keyword}</span>
        </Slide>
        <DropdownButton type="button" onClick={handleButtonClick}>
          <DropdownIcon />
        </DropdownButton>
      </RankingContent>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  ${({ theme }) => theme.TYPO.body_h}
`;

const DivideLine = styled.hr`
  width: 1px;
  height: 16px;
  margin: 0 10px 0 38px;
`;

const RankingContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-grow: 1;
  margin: 0 10px;
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

const DropdownButton = styled.button`
  background-color: transparent;
  cursor: pointer;
`;

export default RankingSlide;
