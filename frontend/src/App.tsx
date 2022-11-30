import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { Reset } from 'styled-reset';
import { PATH_DETAIL, PATH_MAIN, PATH_SEARCH_LIST } from './constants/path';
import Main from './pages/Main/Main';
import SearchList from './pages/SearchList/SearchList';
import PaperDatail from './pages/PaperDetail/PaperDetail';
import GlobalStyle from './style/GlobalStyle';
import theme from './style/theme';
import { AxiosError } from 'axios';
import ErrorBoundary from './error/ErrorBoundary';
import GlobalErrorFallback from './error/GlobalErrorFallback';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      staleTime: 5 * 60 * 1000,
      retry: (failureCount, error) => {
        if (error instanceof AxiosError) {
          return error.response?.status === 408 && failureCount <= 1 ? true : false;
        }
        return false;
      },
      useErrorBoundary: true,
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
          <ErrorBoundary fallback={GlobalErrorFallback}>
            <Routes>
              <Route path={PATH_MAIN} element={<Main />} />
              <Route path={PATH_SEARCH_LIST} element={<SearchList />} />
              <Route path={PATH_DETAIL} element={<PaperDatail />} />
            </Routes>
          </ErrorBoundary>
          <ReactQueryDevtools initialIsOpen={true} />
        </QueryClientProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
