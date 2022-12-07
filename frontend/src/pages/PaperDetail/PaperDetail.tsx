import { useCallback, useState } from 'react';
import { useQuery } from 'react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import Api from '../../api/api';
import IconButton from '../../components/IconButton';
import { PATH_MAIN } from '../../constants/path';
import LogoIcon from '../../icons/LogoIcon';
import PreviousButtonIcon from '../../icons/PreviousButtonIcon';
import { IPaper } from '../SearchList/SearchList';
import PaperInfo from './components/PaperInfo';
import ReferenceGraph from './components/ReferenceGraph';

export interface IPaperDetail extends IPaper {
  referenceList: {
    title?: string;
    authors?: string[];
    doi?: string;
    key: string;
    publishedAt?: string;
    citations?: number;
    references?: number;
  }[];
}

const api = new Api();

const PaperDatail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const doi = searchParams.get('doi') || '';
  const [hoveredNode, setHoveredNode] = useState('');
  const { data } = useQuery<IPaperDetail>(
    ['paperDetail', doi],
    () => api.getPaperDetail({ doi }).then((res) => res.data),
    {
      select: (data) => {
        const referenceList = data.referenceList.filter((reference) => reference.title);
        return { ...data, referenceList };
      },
    },
  );

  const handlePreviousButtonClick = () => {
    navigate(-1);
  };

  const handleLogoClick = () => {
    navigate(PATH_MAIN);
  };

  const changeHoveredNode = useCallback((key: string) => {
    setHoveredNode(key);
  }, []);

  return (
    <Container>
      <Header>
        <IconButton icon={<PreviousButtonIcon />} onClick={handlePreviousButtonClick} />
        <IconButton icon={<LogoIcon height="30" width="30" />} onClick={handleLogoClick} />
      </Header>
      {data && (
        <Main>
          <PaperInfo data={data} hoveredNode={hoveredNode} changeHoveredNode={changeHoveredNode} />
          <ReferenceGraph data={data} hoveredNode={hoveredNode} changeHoveredNode={changeHoveredNode} />
        </Main>
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
  padding: 10px;
`;

const Main = styled.main`
  display: flex;
  width: 100%;
  height: 100%;
`;

export default PaperDatail;
