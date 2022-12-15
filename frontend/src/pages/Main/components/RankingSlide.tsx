import { useInterval } from '@/hooks';
import { Ellipsis } from '@/style/styleUtils';
import { useState } from 'react';
import styled from 'styled-components';

interface IRankingData {
  keyword: string;
  count: number;
}

interface IRankingSlideProps {
  rankingData: IRankingData[];
}

interface ISlideProps {
  transition: string;
  keywordIndex: number;
  dataSize: number;
}

const SLIDE_DELAY = 2500;
const TRANSITION_TIME = 1500;
const TRANSITION_SETTING = `transform linear ${TRANSITION_TIME}ms`;

const RankingSlide = ({ rankingData }: IRankingSlideProps) => {
  const [keywordIndex, setKeywordIndex] = useState(0);
  const [transition, setTransition] = useState('');
  const newRankingData = [...rankingData.slice(0, 10), rankingData[0]];
  const dataSize = newRankingData.length;

  // 마지막 인덱스 도착시 처음 인덱스로 되돌리는 함수
  const replaceSlide = () => {
    setTimeout(() => {
      setTransition('');
      setKeywordIndex(0);
    }, TRANSITION_TIME);
  };

  const moveSlide = () => {
    setTransition(TRANSITION_SETTING);
    setKeywordIndex((prev) => prev + 1);
    if (keywordIndex === dataSize - 2) {
      replaceSlide();
    }
  };

  useInterval(() => {
    moveSlide();
  }, SLIDE_DELAY);

  return (
    <Container>
      <Slide keywordIndex={keywordIndex} transition={transition} dataSize={dataSize}>
        {newRankingData.map((data, index) => (
          <SlideItem key={`${index}${data.keyword}`}>
            <KeywordIndex>{index === dataSize - 1 ? 1 : index + 1}</KeywordIndex>
            <Keyword>{data.keyword}</Keyword>
          </SlideItem>
        ))}
      </Slide>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  height: 25px;
  overflow-y: hidden;
`;

const Slide = styled.ul<ISlideProps>`
  display: flex;
  flex-direction: column;
  width: 100%;
  transition: ${(props) => props.transition};
  transform: ${(props) => `translateY(${(-100 / props.dataSize) * props.keywordIndex}%)`};
`;

const SlideItem = styled.li`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;
  padding: 5px 0;

  span:last-of-type {
    ${({ theme }) => theme.TYPO.body1}
  }
`;

const KeywordIndex = styled.span`
  width: 20px;
`;

const Keyword = styled(Ellipsis)`
  ${({ theme }) => theme.TYPO.body1};
  display: block;
  width: 100%;
`;

export default RankingSlide;
