import { useEffect, useState } from 'react';
import styled from 'styled-components';
import theme from '../style/theme';

// Todo : phase_constants 생성 함수 만들기.
const PHASE_CONSTANTS = [
  '0,1 49,99 A 49,49 0 1,0',
  '0,1 49,99 A 48.02,49 0 1,0',
  '0,1 49,99 A 43.12,49 0 1,0',
  '0,1 49,99 A 36.26,49 0 1,0',
  '0,1 49,99 A 27.44,49 0 1,0',
  '0,1 49,99 A 16.66,49 0 1,0',
  '0,1 49,99 A 5.88,49 0 1,0',
  '0,1 49,99 A 1.96,49 0 1,0',
  '0,1 49,99 A -8.82,49 0 0,1',
  '0,1 49,99 A -19.6,49 0 0,1',
  '0,1 49,99 A -28.42,49 0 0,1',
  '0,1 49,99 A -36.26,49 0 0,1',
  '0,1 49,99 A -43.12,49 0 0,1',
  '0,1 49,99 A -47.04,49 0 0,1',
  '0,1 49,99 A -48.02,49 0 0,1',
  '1,0 49,99 A -48.02,49 0 1,0',
  '1,0 49,99 A -46.06,49 0 1,0',
  '1,0 49,99 A -41.16,49 0 1,0',
  '1,0 49,99 A -36.26,49 0 1,0',
  '1,0 49,99 A -29.4,49 0 1,0',
  '1,0 49,99 A -21.56,49 0 1,0',
  '1,0 49,99 A -12.74,49 0 1,0',
  '1,0 49,99 A -3.92,49 0 1,0',
  '1,0 49,99 A 5.88,49 0 0,1',
  '1,0 49,99 A 14.7,49 0 0,1',
  '1,0 49,99 A 24.5,49 0 0,1',
  '1,0 49,99 A 32.34,49 0 0,1',
  '1,0 49,99 A 39.2,49 0 0,1',
  '1,0 49,99 A 45.08,49 0 0,1',
  '1,0 49,99 A 49,49 0 0,1',
];

const MoonLoader = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % PHASE_CONSTANTS.length);
    }, 100);
    return () => clearInterval(timer);
  }, []);

  return (
    <MoonContainer>
      <svg width="50" height="50" viewBox="0 0 100 100" style={{ filter: 'url(#inset-shadow)' }}>
        <defs>
          <filter id="inset-shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feComponentTransfer in="SourceAlpha">
              <feFuncA type="table" tableValues="1 0" />
            </feComponentTransfer>
            <feGaussianBlur stdDeviation="9" />
            <feOffset dx="0" dy="0" result="offsetblur" />
            <feFlood floodColor="rgb(0, 0, 0, 0.7)" result="color" />
            <feComposite in2="offsetblur" operator="in" />
            <feComposite in2="SourceAlpha" operator="in" />
            <feMerge>
              <feMergeNode in="SourceGraphic" />
              <feMergeNode />
            </feMerge>
          </filter>
          <pattern id="image11" x="0" y="0" patternUnits="userSpaceOnUse" height="100" width="100">
            <image x="0" y="0" height="100" width="100" xlinkHref="https://www.icalendar37.net/lunar/api/i.png"></image>
          </pattern>
        </defs>
        <g>
          <circle cx="50" cy="50" r="48" stroke="0" fill={theme.COLOR.primary4} />
          <path d={`M 50 1 A 49,49 0 ${PHASE_CONSTANTS[index]} 50,1`} fill={theme.COLOR.offWhite} />
          <circle cx="50" cy="50" r="50" strokeWidth="0" fill="url(#image11)" />
        </g>
      </svg>
    </MoonContainer>
  );
};

const MoonContainer = styled.div`
  text-align: center;
  margin-top: 25px;
`;

export default MoonLoader;
