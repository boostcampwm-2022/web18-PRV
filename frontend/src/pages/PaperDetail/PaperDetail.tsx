import { IPaperDetail } from '@/api/api';
import { IconButton, MoonLoader } from '@/components';
import { PATH_MAIN } from '@/constants/path';
import { LogoIcon, PreviousButtonIcon } from '@/icons';
import { usePaperQuery } from '@/queries/queries';
import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import ColorRangeBar from './components/ColorRangeBar';
import PaperInfo from './components/PaperInfo';
import ReferenceGraph from './components/ReferenceGraph';

const PaperDatail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [data, setData] = useState<IPaperDetail>(location.state?.initialData);
  const [searchParams] = useSearchParams();
  const [doi, setDoi] = useState<string>(searchParams.get('doi') || '');
  const [hoveredNode, setHoveredNode] = useState('');

  const { isLoading, data: _data } = usePaperQuery(doi.toLowerCase());

  const handlePreviousButtonClick = () => {
    navigate(-1);
  };

  const handleLogoClick = () => {
    navigate(PATH_MAIN);
  };

  const changeHoveredNode = useCallback((key: string) => {
    setHoveredNode(key.toLowerCase());
  }, []);

  const addChildrensNodes = useCallback(async (doi: string) => {
    setDoi(doi);
  }, []);

  useEffect(() => {
    if (!_data) return;
    setData(_data);
  }, [_data]);

  return (
    <Container>
      <Header>
        {location.state?.hasPrevPage && (
          <IconButton icon={<PreviousButtonIcon />} onClick={handlePreviousButtonClick} aria-label="뒤로가기" />
        )}
        <IconButton icon={<LogoIcon height="30" width="30" />} onClick={handleLogoClick} aria-label="메인으로" />
      </Header>
      <Main>
        {data && (
          <>
            <PaperInfo
              data={data}
              hoveredNode={hoveredNode}
              changeHoveredNode={changeHoveredNode}
              addChildrensNodes={addChildrensNodes}
            />
            <ReferenceGraph
              data={data}
              hoveredNode={hoveredNode}
              changeHoveredNode={changeHoveredNode}
              addChildrensNodes={addChildrensNodes}
            />
          </>
        )}
      </Main>
      <ColorRangeBar />
      {isLoading && (
        <LoaderWrapper>
          <MoonLoader />
        </LoaderWrapper>
      )}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  height: 100%;
  background-color: ${({ theme }) => theme.COLOR.primary4};
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 50px;
  padding: 10px 10px 0;
`;

const Main = styled.main`
  display: flex;
  width: 100%;
  height: 100%;
`;

const LoaderWrapper = styled.div`
  position: absolute;
  z-index: 10;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.COLOR.primary4}50;
`;

export default PaperDatail;
