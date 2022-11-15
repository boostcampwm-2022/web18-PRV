import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  @font-face {
      font-family: 'times-new-roman';
      src: url('font/times-new-roman.ttf');
      font-weight: normal;
      font-style: normal;
  }

  *, *::before, *::after {
    font-family: 'times-new-roman';
    box-sizing: border-box;
  }

  #root {
    height: 100vh;
    font-family:'times-new-roman';
  }

  button, input{    
    border: none;
    outline: none;
    padding: 0;
  }

  li{
    list-style: none;
  }
`;

export default GlobalStyle;
