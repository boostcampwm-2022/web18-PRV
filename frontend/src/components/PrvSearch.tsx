import styled from 'styled-components';
import MaginifyingGlassIcon from '../icons/MagnifyingGlassIcon';

const PrvSearch = () => {
	return (
		<SearchBar>
			<SearchInput placeholder="저자, 제목, 키워드"></SearchInput>
			<SearchButton type="button">
				<MaginifyingGlassIcon />
			</SearchButton>
		</SearchBar>
	);
};

const SearchBar = styled.div`
	display: flex;
	justify-content: flex-start;
	align-items: center;
	position: relative;
	width: 500px;
	height: 50px;
	margin-top: 20px;
	padding: 10px;
	background-color: ${({ theme }) => theme.COLOR.offWhite};
	border-radius: 50px;
`;

const SearchInput = styled.input`
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 100%;
	background-color: transparent;
	text-align: center;
	${({ theme }) => theme.TYPO.body_h}
	::placeholder {
		color: ${({ theme }) => theme.COLOR.gray2};
	}
`;

const SearchButton = styled.button`
	position: absolute;
	right: 25px;
	width: 25px;
	height: 25px;
	background-color: transparent;
	cursor: pointer;
`;

export default PrvSearch;
