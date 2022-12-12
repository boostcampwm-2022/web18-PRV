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
      <ColorRange>
        {colors.map((color) => (
          <div key={color} style={{ background: color }} />
        ))}
      </ColorRange>

      <Axis>
        {axisNums.map((num, i) => (
          <span key={num} style={{ color: colors[i], left: `${(100 / axisNums.length) * i}%` }}>
            {num}
            {i === axisNums.length - 1}
          </span>
        ))}
        <span style={{ color: colors[colors.length - 1], left: '100%' }}>
          {axisNums[axisNums.length - 1]}
          {'+'}
        </span>
      </Axis>
    </Container>
  );
};

const Container = styled.div`
  ${({ theme }) => theme.TYPO.caption};
  position: absolute;
  bottom: 30px;
  right: 30px;
  > label {
    color: ${(props) => props.theme.COLOR.offWhite};
    margin: 0 0 0 auto;
  }
`;

const ColorRange = styled.div`
  margin: 0 auto;
  width: 200px;
  height: 20px;
  margin: 10px 0;
  display: flex;
  > div {
    flex: 1;
  }
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
