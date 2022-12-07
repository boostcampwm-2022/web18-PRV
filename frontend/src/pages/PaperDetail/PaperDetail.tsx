import { useEffect, useState } from 'react';
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
  title: string;
  authors: string[];
  publishedAt: string;
  citations: number;
  references: number;
  key: string;
  doi?: string;
}
export interface IPaperDetail extends IPaper {
  referenceList: IReference[];
}

const api = new Api();

const PaperDatail = () => {
  const navigate = useNavigate();
  const [paperInfos, setPaperInfos] = useState<IPaperDetail[]>([]);
  const [searchParams] = useSearchParams();
  const doi = searchParams.get('doi') || '';

  const { data } = useQuery<IPaperDetail>(
    ['paperDetail', doi],
    () => api.getPaperDetail({ doi }).then((res) => res.data),
    {
      enabled: !!doi.length,
    },
  );

  const handlePreviousButtonClick = () => {
    navigate(-1);
  };

  const handleLogoClick = () => {
    navigate(PATH_MAIN);
  };

  const addChildrensNodes = async (data: any) => {
    if (!data.doi) {
      console.log('doi 없음');
      return;
    }
    if (data.isSelected) {
      console.log('이미 렌더링된 노드');
      return;
    }
    const result = await api.getPaperDetail({ doi: data.doi }).then((res) => res.data);
    setPaperInfos((prev) => [...prev, result]);
  };

  useEffect(() => {
    if (!data) return;
    setPaperInfos((prev) => [...prev, data]);
  }, [data]);

  return (
    <Container>
      <Header>
        <IconButton icon={<PreviousButtonIcon />} onClick={handlePreviousButtonClick} />
        <IconButton icon={<LogoIcon height="30" width="30" />} onClick={handleLogoClick} />
      </Header>
      <Main>
        {data && <PaperInfo data={data} />}
        {paperInfos && <ReferenceGraph paperInfos={paperInfos} addChildrensNodes={addChildrensNodes} />}
      </Main>
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
