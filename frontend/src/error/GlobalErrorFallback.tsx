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
      <H1>Oops!</H1>
      <H2>{code || 404} Error occurred</H2>
      <Link to="/">
        <Button>Go Home</Button>
      </Link>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  gap: 30px;
  background-color: ${({ theme }) => theme.COLOR.primary3};
  color: ${({ theme }) => theme.COLOR.offWhite};
`;

const H1 = styled.h1`
  font-size: 70px;
  font-weight: 700;
  margin-bottom: 35px;
`;

const H2 = styled.h2`
  ${({ theme }) => theme.TYPO.title}
`;

const Button = styled.button`
  padding: 10px 20px;
  color: ${({ theme }) => theme.COLOR.offWhite};
  background-color: ${({ theme }) => theme.COLOR.primary2};
  border-radius: 20px;
  cursor: pointer;
`;

export default GlobalErrorFallback;
