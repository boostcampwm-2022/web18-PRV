import styled from 'styled-components';

interface IRankingData {
  keyword: string;
  count: number;
}

interface IRankingSlideProps {
  rankingData: IRankingData[];
}

const RankingSlide = ({ rankingData }: IRankingSlideProps) => {
  return (
    <Slide>
      <span>1</span>
      <span>{rankingData[0].keyword}</span>
    </Slide>
  );
};

const Slide = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;

  span:last-of-type {
    ${({ theme }) => theme.TYPO.body1}
  }
`;

export default RankingSlide;
