import { AxiosError } from 'axios';
import React, { Suspense } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { Route, Routes, useLocation } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { Reset } from 'styled-reset';
import LoaderWrapper from './components/loader/LoaderWrapper';
import { PATH_DETAIL, PATH_MAIN, PATH_SEARCH_LIST } from './constants/path';
import ErrorBoundary from './error/ErrorBoundary';
import GlobalStyle from './style/GlobalStyle';
import theme from './style/theme';

const Main = React.lazy(() => import('./pages/Main/Main'));
const SearchList = React.lazy(() => import('./pages/SearchList/SearchList'));
const GlobalErrorFallback = React.lazy(() => import('./error/GlobalErrorFallback'));
const PaperDatail = React.lazy(() => import('./pages/PaperDetail/PaperDetail'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      staleTime: 10 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
      retry: (failureCount, error) => {
        if (error instanceof AxiosError) {
          return error.response?.status === 408 && failureCount <= 1 ? true : false;
        }
        return false;
      },
      suspense: true,
    },
  },
});

function App() {
  const location = useLocation();

  return (
    <ThemeProvider theme={theme}>
      <Reset />
      <GlobalStyle />
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary fallback={GlobalErrorFallback} key={location.pathname}>
          <Suspense fallback={<LoaderWrapper />}>
            <Routes>
              <Route path={PATH_MAIN} element={<Main />} />
              <Route path={PATH_SEARCH_LIST} element={<SearchList />} />
              <Route path={PATH_DETAIL} element={<PaperDatail />} />
              <Route path={'*'} element={<GlobalErrorFallback />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
        <ReactQueryDevtools initialIsOpen={true} />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
