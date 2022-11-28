import { useSearchParams } from 'react-router-dom';

const PaperDatail = () => {
  const [searchParams] = useSearchParams();
  const doi = searchParams.get('doi');

  return <h1>{doi}</h1>;
};

export default PaperDatail;
