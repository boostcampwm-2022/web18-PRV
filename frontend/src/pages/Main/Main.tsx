import styled from 'styled-components';
import PrvFooter from '../../components/PrvFooter';
import PrvLogo from '../../components/PrvLogo';
import Popular from './popular/Popular';
import Search from './search/Search';

const Main = () => {
	return (
		<Container>
			<MainContainer>
				<TitleContainer>
					<PrvLogo />
					<Title>PRV</Title>
				</TitleContainer>
				<ContentContainer>
					<span>Paper Reference Visualization</span>
					<span>논문간 인용관계 시각화 솔루션</span>
					<span>This website renders reference relation of paper</span>
				</ContentContainer>
				<Popular />
				<Search />
			</MainContainer>
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
	color: ${({ theme }) => theme.COLOR.offWhite};
`;

const MainContainer = styled.main`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: 10px;
	height: 100%;
`;

const TitleContainer = styled.div`
	display: flex;
	align-items: center;
	gap: 10px;
`;

const Title = styled.span`
	font-size: 36px;
`;

const ContentContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 10px;
	font-size: 12px;
`;

export default Main;
