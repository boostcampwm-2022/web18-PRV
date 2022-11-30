import { AxiosError } from 'axios';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

interface IProps {
  error?: AxiosError;
}

const GlobalErrorFallback = ({ error }: IProps) => {
  const code = error?.response?.status;

  return (
    <Container>
      <h1>{code || 404} Error</h1>
      <Link to="/">
        <button>return to home</button>
      </Link>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
`;

export default GlobalErrorFallback;
