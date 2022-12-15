import React from 'react';
import ReactDOM from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import { ThemeProvider } from 'styled-components';
import theme from './style/theme';
import Footer from './components/Footer';

let container: HTMLDivElement;
beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});
afterEach(() => {
  document.body.removeChild(container);
});

it('Footer 렌더링 테스트', () => {
  act(() => {
    ReactDOM.createRoot(container).render(
      <ThemeProvider theme={theme}>
        <Footer bgColor="black" contentColor="black" />
      </ThemeProvider>,
    );
  });
  const span = container?.querySelector('span');
  expect(span?.textContent).toBe('문의사항, 버그제보: vp.prv@gmail.com');
});
