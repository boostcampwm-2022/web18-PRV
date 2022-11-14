import styled from 'styled-components';

const Popular = () => {
	return (
		<PopularBar>
			<span>인기 검색어</span>
			<DivLine />
			<PopularContent>
				<PopularSlide>
					<span>1</span>
					<span>metaverse</span>
				</PopularSlide>
				<DropdownBtn type="button">
					<img src="assets/dropdown-icon.svg" alt="dropdown button" />
				</DropdownBtn>
			</PopularContent>
		</PopularBar>
	);
};

const PopularBar = styled.div`
	display: flex;
	justify-content: flex-start;
	align-items: center;
	width: 500px;
	height: 38px;
	margin-top: 30px;
	padding: 5px 15px;
	border: 1px solid ${({ theme }) => theme.COLOR.offWhite};
	border-radius: 20px;
	font-size: 14px;
	font-weight: 600;
`;

const DivLine = styled.hr`
	width: 1px;
	height: 22px;
	margin: 0 10px 0 38px;
`;

const PopularContent = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	flex-grow: 1;
	margin: 0 10px;
`;

const PopularSlide = styled.div`
	display: flex;
	justify-content: flex-start;
	align-items: center;
	gap: 8px;

	span:first-child {
		font-weight: 600;
	}
`;

const DropdownBtn = styled.button`
	background-color: transparent;
	cursor: pointer;
`;

export default Popular;
