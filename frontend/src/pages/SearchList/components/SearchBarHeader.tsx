import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Search from '../../../components/search/Search';
import StarLayer from '../../../components/StarLayer';
import { PATH_MAIN } from '../../../constants/path';
import LogoIcon from '../../../icons/LogoIcon';

interface SearchBarHeaderProps {
  keyword: string;
}

const SearchBarHeader = ({ keyword }: SearchBarHeaderProps) => {
  const navigate = useNavigate();

  const handleIconClick = () => {
    navigate(PATH_MAIN);
  };

  return (
    <Container>
      <StarLayer />
      <Logo onClick={handleIconClick}>
        <LogoIcon />
      </Logo>
      <Positioner>
        <Search initialKeyword={keyword} />
      </Positioner>
    </Container>
  );
};

const Container = styled.header`
  padding: 0;
  position: relative;
  text-align: center;
  width: 100%;
  height: 70px;
  background-color: ${({ theme }) => theme.COLOR.primary3};
`;

const Logo = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 16px;
  z-index: 4;
  cursor: pointer;
`;

const Positioner = styled.div`
  position: absolute;
  width: 100%;
  margin: 10px auto;
  flex: 1;
`;

export default SearchBarHeader;
