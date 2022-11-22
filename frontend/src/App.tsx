import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { Reset } from 'styled-reset';
import { PATH_MAIN, PATH_SEARCH_LIST } from './constants/path';
import Main from './pages/Main/Main';
import SearchList from './pages/SearchList/SearchList';
import GlobalStyle from './style/GlobalStyle';
import theme from './style/theme';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function App() {
  return (
    <BrowserRouter>
      <Reset />
      <GlobalStyle />
      <ThemeProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <Routes>
            <Route path={PATH_MAIN} element={<Main />} />
            <Route path={PATH_SEARCH_LIST} element={<SearchList />} />
          </Routes>
          {/* <ReactQueryDevtools initialIsOpen={true} /> */}
        </QueryClientProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
