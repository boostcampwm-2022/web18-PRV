import { debounce } from 'lodash-es';
import { useEffect, useMemo, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import theme from '../../../style/theme';

const COLORS = [
  theme.COLOR.secondary1,
  theme.COLOR.secondary2,
  theme.COLOR.primary1,
  theme.COLOR.primary2,
  theme.COLOR.offWhite,
];

const StarLayer = () => {
  const [height, setHeight] = useState<number>(0);
  const [width, setWidth] = useState<number>(0);

  const layerCount = 15;
  const starDensity = Math.trunc(((height * width) / 600000) * layerCount);

  const resizeCallback = useMemo(
    () =>
      debounce(() => {
        setHeight(window.innerHeight);
        setWidth(window.innerWidth);
      }, 150),
    [],
  );

  useEffect(() => {
    resizeCallback();
    window.addEventListener('resize', resizeCallback);
    return () => window.removeEventListener('resize', resizeCallback);
  }, [resizeCallback]);

  return (
    <Container>
      {Array.from({ length: layerCount }, (_, i) => {
        const randomConstant = Math.random();
        return (
          <Stars
            key={i}
            style={{
              animationDuration: `${randomConstant * 5 + 5}s`,
              animationDelay: `${randomConstant * 5}s`,
            }}
          >
            {Array.from({ length: starDensity }, (_, j) => (
              <Star
                key={j}
                style={{
                  backgroundColor: `${COLORS[j % COLORS.length]}`,
                  width: `${randomConstant * 2 + 1}px`,
                  height: `${randomConstant * 2 + 1}px`,
                  top: `${Math.random() * height}px`,
                  left: `${Math.random() * width}px`,
                }}
              >
                <Blur />
              </Star>
            ))}
          </Stars>
        );
      })}
    </Container>
  );
};

const Container = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const twinkle = keyframes`
  0% {
    opacity: 0;
    animation-timing-function: ease-in;
  }

  60% {
    opacity: 1;
    animation-timing-function: ease-out;
  }

  80% {
    opacity: 0;
  }

  100% {
    opacity: 0;
  }
`;

const Stars = styled.div`
  opacity: 0;
  animation-name: ${twinkle};
  animation-timing-function: linear;
  animation-iteration-count: infinite;
`;

const Star = styled.div`
  position: absolute;
  background: ${theme.COLOR.offWhite};
  border-radius: 5px;
`;

const Blur = styled.div`
  background: inherit;
  width: inherit;
  height: inherit;
  border-radius: inherit;
  filter: blur(5px);
`;

export default StarLayer;
