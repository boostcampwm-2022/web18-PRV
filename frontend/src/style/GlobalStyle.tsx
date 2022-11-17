import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
    font-family: 'Times New Roman', sans-serif;
  }

  #root {
    height: 100vh;
    font-family: 'Times New Roman', sans-serif;
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
