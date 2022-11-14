import styled from 'styled-components';
import PrvFooter from '../../components/PrvFooter';

const Main = () => {
	return (
		<Container>
			<div>main</div>
			<PrvFooter />
		</Container>
	);
};

const Container = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	height: 100%;
	background-color: ${({ theme }) => theme.COLOR.primary3};
`;

export default Main;
