import { AxiosError } from 'axios';

interface IProps {
  error: AxiosError;
}

const GlobalErrorFallback = ({ error }: IProps) => {
  const code = error.response?.status;

  return <h1>{code} Error</h1>;
};

export default GlobalErrorFallback;
