import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { Reset } from 'styled-reset';
import { PATH_MAIN } from './constants/path';
import Main from './pages/Main/Main';
import GlobalStyle from './style/GlobalStyle';
import theme from './style/theme';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <Reset />
        <GlobalStyle />
        <Routes>
          <Route path={PATH_MAIN} element={<Main />}></Route>
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
