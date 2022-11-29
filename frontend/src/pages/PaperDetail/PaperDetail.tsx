import { AxiosError } from 'axios';
import { useQuery } from 'react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import Api from '../../api/api';
import MoonLoader from '../../components/MoonLoader';
import PreviousButtonIcon from '../../icons/PreviousButtonIcon';
import LogoIcon from '../../icons/LogoIcon';
import { IPaper } from '../SearchList/SearchList';
import PaperInfo from './components/PaperInfo';
import ReferenceGragh from './components/ReferenceGragh';
import { PATH_MAIN } from '../../constants/path';
import IconButton from '../../components/IconButton';

export interface IPaperDetail extends IPaper {
  referenceList: [
    {
      title: string;
      author: string;
      publishedAt: string;
      citations: number;
      references: number;
      doi: string;
    },
  ];
}

const api = new Api();

const PaperDatail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const doi = searchParams.get('doi') || '';
  const { data, isLoading } = useQuery<IPaperDetail, AxiosError>(
    ['paperDetail', doi],
    () => api.getPaperDetail({ doi }).then((res) => res.data),
    { enabled: !!doi.length },
  );

  const handlePreviousButtonClick = () => {
    navigate(-1);
  };

  const handleLogoClick = () => {
    navigate(PATH_MAIN);
  };

  return (
    <Container>
      {isLoading ? (
        <MoonWrapper>
          <MoonLoader />
        </MoonWrapper>
      ) : (
        <>
          <Header>
            <IconButton icon={<PreviousButtonIcon />} onClick={handlePreviousButtonClick} />
            <IconButton icon={<LogoIcon height="30" width="30" />} onClick={handleLogoClick} />
          </Header>
          {data && (
            <Main>
              <PaperInfo data={data} />
              <ReferenceGragh />
            </Main>
          )}
        </>
      )}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  height: 100%;
  background-color: ${({ theme }) => theme.COLOR.primary4};
`;

const MoonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  padding: 10px;
`;

const Main = styled.main`
  display: flex;
  width: 100%;
  height: 100%;
`;

export default PaperDatail;
