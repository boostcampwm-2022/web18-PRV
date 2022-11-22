import styled from 'styled-components';
import GithubLogoIcon from '../icons/GithubLogoIcon';

interface FooterProps {
  bgColor?: string;
  contentColor?: string;
}

const Footer = ({ bgColor, contentColor }: FooterProps) => {
  return (
    <Container bgColor={bgColor} contentColor={contentColor}>
      <span>문의사항, 버그제보: vp.prv@gmail.com</span>
      <FooterRight>
        <span>Copyright Ⓒ 2022. View Point All rights reserved.</span>
        <a href="https://github.com/boostcampwm-2022/web18-PRV" rel="noreferrer" target="_blank">
          <GithubLogoIcon />
        </a>
      </FooterRight>
    </Container>
  );
};

const Container = styled.footer<{ bgColor?: string; contentColor?: string }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 45px;
  padding: 0 25px;
  background-color: ${({ bgColor, theme }) => bgColor || `${theme.COLOR.offWhite}10`};
  color: ${({ contentColor, theme }) => contentColor || theme.COLOR.gray1};
  ${({ theme }) => theme.TYPO.caption}
`;

const FooterRight = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

export default Footer;
