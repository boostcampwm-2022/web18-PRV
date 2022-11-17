import { debounce } from 'lodash-es';
import { useCallback, useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import theme from '../style/theme';

const StarLayer = () => {
  const [height, setHeight] = useState<number>(0);
  const [width, setWidth] = useState<number>(0);

  const resizeCallback = useCallback(
    debounce(() => {
      setHeight(window.innerHeight);
      setWidth(window.innerWidth);
    }, 150),
    [],
  );

  useEffect(() => {
    resizeCallback();
    window.addEventListener('resize', resizeCallback);
  }, []);

  return (
    <Container>
      {Array.from({ length: 100 }).map((v, i) => {
        const randomSize = Math.random();
        
        return (
          <Star
            key={i}
            style={{
              width: `${randomSize * 3 + 1}px`,
              height: `${randomSize * 3 + 1}px`,
              animationDuration: `${Math.random() * 5 + 5}s`,
              animationDelay: `${Math.random() * 5}s`,
              top: `${Math.random() * height}px`,
              left: `${Math.random() * width}px`,
            }}
          >
            <Blur />
          </Star>
        );
      })}
    </Container>
  );
};

const Container = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
`;

const twinkle = keyframes`
  0% {
    transform: scale(1, 1);
    background: ${theme.COLOR.offWhite}00;
    animation-timing-function: ease-in;
  }

  60% {
    transform: scale(0.8, 0.8);
    background: ${theme.COLOR.offWhite}99;
    animation-timing-function: ease-out;
  }

  80% {
    background: ${theme.COLOR.offWhite}00;
    transform: scale(1, 1);
  }

  100% {
    background: ${theme.COLOR.offWhite}00;
    transform: scale(1, 1);
  }
`;

const Star = styled.div`
  position: absolute;
  background: ${theme.COLOR.offWhite}00;
  border-radius: 5px;
  animation-name: ${twinkle};
  animation-timing-function: linear;
  animation-iteration-count: infinite;
`;

const Blur = styled.div`
  background: inherit;
  width: inherit;
  height: inherit;
  border-radius: inherit;
  animation-name: inherit;
  animation-timing-function: inherit;
  animation-iteration-count: inherit;
  filter: blur(5px);
`;

export default StarLayer;
