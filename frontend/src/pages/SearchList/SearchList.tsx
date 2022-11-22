import { isEmpty } from 'lodash-es';
import { useQuery } from 'react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import Api from '../../api/api';
import Search from '../../components/Search';
import StarLayer from '../../components/StarLayer';
import { PATH_MAIN } from '../../constants/path';
import LogoIcon from '../../icons/LogoIcon';

const api = new Api();

interface Paper {
  title: string;
  authors: [
    {
      given?: string;
      family?: string;
      name?: string;
    },
  ];
  publishedAt: string;
  citations: number;
  references: number;
  doi?: string;
}

interface PageInfo {
  totalItems: number;
  totalPages: number;
}

const SearchList = () => {
  const [searchParams] = useSearchParams();
  const params = Object.fromEntries([...searchParams]);
  const navigate = useNavigate();

  const { data } = useQuery(['papers', params], () => api.getSearch(params), {
    enabled: !isEmpty(params),
  });

  const handleIconClick = () => {
    navigate({
      pathname: PATH_MAIN,
    });
  };

  return (
    <Header>
      <StarLayer />
      <IconContainer onClick={handleIconClick}>
        <LogoIcon />
      </IconContainer>
      <SaerchContainer>
        <Search initialKeyword={params.keyword} />
      </SaerchContainer>
    </Header>
  );
};

const Header = styled.header`
  padding: 0;
  position: relative;
  text-align: center;
  width: 100%;
  height: 70px;
  background-color: ${({ theme }) => theme.COLOR.primary3};
`;

const IconContainer = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 16px;
  z-index: 4;
  cursor: pointer;
`;

const SaerchContainer = styled.div`
  position: absolute;
  width: 100%;
  margin: 10px auto;
`;
export default SearchList;
