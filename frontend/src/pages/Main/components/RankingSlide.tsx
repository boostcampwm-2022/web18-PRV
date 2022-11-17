import { useState } from 'react';
import styled from 'styled-components';
import useInterval from '../../../customHooks/useInterval';

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
    <Slide keywordIndex={keywordIndex} transition={transition} dataSize={dataSize}>
      {newRankingData.map((data, index) => (
        <SlideItem key={`${index}${data.keyword}`}>
          <span>{index === dataSize - 1 ? 1 : index + 1}</span>
          <span>{data.keyword}</span>
        </SlideItem>
      ))}
    </Slide>
  );
};

const Slide = styled.ul<ISlideProps>`
  display: flex;
  flex-direction: column;
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

export default RankingSlide;
