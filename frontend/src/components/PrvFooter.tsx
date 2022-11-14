import styled from 'styled-components';

const PrvFooter = () => {
	return <Container>footer</Container>;
};

const Container = styled.footer`
	width: 100%;
	height: 45px;
	background-color: ${({ theme }) => `${theme.COLOR.offWhite}10`};
`;

export default PrvFooter;
