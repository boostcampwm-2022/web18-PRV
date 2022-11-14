import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import Main from './pages/Main/Main';
import GlobalStyle from './style/GlobalStyle';
import theme from './style/theme';

function App() {
	return (
		<BrowserRouter>
			<ThemeProvider theme={theme}>
				<GlobalStyle />
				<Routes>
					<Route path="/" element={<Main />}></Route>
				</Routes>
			</ThemeProvider>
		</BrowserRouter>
	);
}

export default App;
