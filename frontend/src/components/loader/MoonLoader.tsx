import * as d3 from 'd3';
import { memo, useEffect, useRef } from 'react';
import styled from 'styled-components';
import theme from '../../style/theme';

const MoonLoader = () => {
  const pathRef = useRef<SVGPathElement>(null);
  const moonSize = 50;

  const calculateMoonLightPath = (radian: number) => {
    return `M 50,0
    A 50,50 0 0 ${Math.floor(radian / Math.PI) % 2} 50,100
    A ${50 * Math.cos(radian)},50 0 0 ${Math.floor((radian / Math.PI) * 2) % 2} 50,0`;
  };

  useEffect(() => {
    let radian = Math.PI;
    const timer = d3.interval(() => {
      d3.select(pathRef.current).attr('d', calculateMoonLightPath(radian));
      radian += Math.PI / 10;
    }, 100);
    return () => timer.stop();
  }, []);

  return (
    <MoonContainer>
      <svg width={moonSize} height={moonSize} viewBox="0 0 100 100" style={{ filter: 'url(#inset-shadow)' }}>
        <defs>
          <filter id="inset-shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feComponentTransfer in="SourceAlpha">
              <feFuncA type="table" tableValues="1 0" />
            </feComponentTransfer>
            <feGaussianBlur stdDeviation="3" />
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
            <image x="0" y="0" height="100" width="100" xlinkHref="assets/moon.png"></image>
          </pattern>
        </defs>
        <g>
          <circle cx="50" cy="50" r="49" stroke="0" fill={theme.COLOR.primary4} />
          <path ref={pathRef} fill={theme.COLOR.offWhite} />
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

export default memo(MoonLoader);
