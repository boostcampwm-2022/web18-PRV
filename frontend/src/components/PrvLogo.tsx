import styled from 'styled-components';

const PrvLogo = () => {
  return <Logo src={'/assets/prv-logo.png'} alt="logo" />;
};

const Logo = styled.img`
  width: 50px;
  height: 50px;
`;

export default PrvLogo;
