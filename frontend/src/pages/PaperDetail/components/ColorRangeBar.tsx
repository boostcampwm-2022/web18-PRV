import * as d3 from 'd3';
import styled from 'styled-components';
import theme from '../../../style/theme';

const ColorRangeBar = () => {
  const converToColor = d3.scaleLog([1, 10000], ['white', theme.COLOR.secondary2]).interpolate(d3.interpolateRgb);
  const axisNums = [1, 10, 100, 1000, 10000];
  const colors = axisNums.map(converToColor);

  return (
    <Container>
      <label>citations</label>
      <ColorRange style={{ background: `linear-gradient(90deg,${colors.join(', ')})` }} />
      <Axis>
        {axisNums.map((num, i) => (
          <span key={num} style={{ color: colors[i], left: `${(100 / (axisNums.length - 1)) * i}%` }}>
            {num}
            {i === axisNums.length - 1 && '+'}
          </span>
        ))}
      </Axis>
    </Container>
  );
};

const Container = styled.div`
  ${({ theme }) => theme.TYPO.caption};
  position: absolute;
  bottom: 30px;
  right: 30px;
  opacity: 0.3;
  :hover {
    opacity: 1;
  }
  > label {
    color: ${(props) => props.theme.COLOR.offWhite};
    margin: 0 0 0 auto;
  }
`;

const ColorRange = styled.div`
  margin: 0 auto;
  width: 300px;
  height: 30px;
  background: linear-gradient(90deg, rgba(2, 0, 36, 1) 0%, rgba(9, 9, 121, 1) 32%, rgba(0, 212, 255, 1) 100%);
  margin: 10px 0;
`;

const Axis = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  ${({ theme }) => theme.TYPO.caption};
  color: ${(props) => props.theme.COLOR.offWhite};
  > span {
    position: absolute;
    transform: translateX(-50%);
  }
`;

export default ColorRangeBar;
