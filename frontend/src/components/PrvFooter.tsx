import styled from 'styled-components';

const PrvFooter = () => {
	return (
		<Container>
			<span>문의사항, 버그제보: vp.prv@gmail.com</span>
			<FooterRight>
				<span>Copyright Ⓒ 2022. View Point All rights reserved.</span>
				<a href="https://github.com/boostcampwm-2022/web18-PRV" rel="noreferrer" target="_blank">
					<img src="assets/github-logo.svg" alt="github logo" />
				</a>
			</FooterRight>
		</Container>
	);
};

const Container = styled.footer`
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
	height: 45px;
	padding: 0 25px;
	background-color: ${({ theme }) => `${theme.COLOR.offWhite}10`};
	font-size: 10px;
	color: ${({ theme }) => `${theme.COLOR.gray1}`};
`;

const FooterRight = styled.div`
	display: flex;
	align-items: center;
	gap: 15px;
`;

export default PrvFooter;
