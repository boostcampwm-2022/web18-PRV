import styled from 'styled-components';
import MoonLoader from './MoonLoader';

const LoaderWrapper = () => {
  return (
    <MoonWrapper>
      <MoonLoader />
    </MoonWrapper>
  );
};

const MoonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  flex: 1;
`;

export default LoaderWrapper;
