import { useCallback, useEffect, useState } from 'react';
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

export interface IReference {
  key: string;
  title?: string;
  authors?: string[];
  doi?: string;
  publishedAt?: string;
  citations?: number;
  references?: number;
}
export interface IPaperDetail extends IPaper {
  referenceList: IReference[];
}

const api = new Api();

const PaperDatail = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<IPaperDetail>();
  const [searchParams] = useSearchParams();
  const doi = searchParams.get('doi') || '';
  const [hoveredNode, setHoveredNode] = useState('');
  const { data: _data } = useQuery<IPaperDetail>(
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

  const addChildrensNodes = useCallback(async (data: any) => {
    const result = await api.getPaperDetail({ doi: data.doi }).then((res) => res.data);
    setData(result);
  }, []);

  useEffect(() => {
    if (!_data) return;
    setData(_data);
  }, [_data]);

  return (
    <Container>
      <Header>
        <IconButton icon={<PreviousButtonIcon />} onClick={handlePreviousButtonClick} />
        <IconButton icon={<LogoIcon height="30" width="30" />} onClick={handleLogoClick} />
      </Header>
      <Main>
        {data && <PaperInfo data={data} hoveredNode={hoveredNode} changeHoveredNode={changeHoveredNode} />}
        {data && (
          <ReferenceGraph
            data={data}
            hoveredNode={hoveredNode}
            changeHoveredNode={changeHoveredNode}
            addChildrensNodes={addChildrensNodes}
          />
        )}
      </Main>
      )
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
