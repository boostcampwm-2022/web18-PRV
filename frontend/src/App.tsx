import { ThemeProvider } from 'styled-components';
import GlobalStyle from './style/GlobalStyle';
import theme from './style/theme';

function App() {
	return (
		<>
			<ThemeProvider theme={theme}>
				<GlobalStyle />
				<div className="App">
					<div>hello my name is palwol 안녕하세요</div>
				</div>
			</ThemeProvider>
		</>
	);
}

export default App;
