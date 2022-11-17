import styled from 'styled-components';

const Logo = () => {
  return <LogoImg src={'/assets/prv-logo.png'} alt="logo" />;
};

const LogoImg = styled.img`
  width: 50px;
  height: 50px;
`;

export default Logo;
