import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { Reset } from 'styled-reset';
import { PATH_MAIN, PATH_SEARCH_LIST } from './constants/path';
import Main from './pages/Main/Main';
import SearchList from './pages/SearchList/SearchList';
import GlobalStyle from './style/GlobalStyle';
import theme from './style/theme';

function App() {
  return (
    <BrowserRouter>
      <Reset />
      <GlobalStyle />
      <ThemeProvider theme={theme}>
        <Routes>
          <Route path={PATH_MAIN} element={<Main />} />
          <Route path={PATH_SEARCH_LIST} element={<SearchList />} />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
