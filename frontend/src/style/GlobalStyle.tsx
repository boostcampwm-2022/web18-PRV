import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
    font-family: 'Merriweather', serif;
  }

  #root {
    height: 100vh;
    font-family: 'Merriweather', serif;
  }

  button, input{    
    border: none;
    outline: none;
    padding: 0;
  }

  li{
    list-style: none;
  }

  a {
    color: inherit;
    text-decoration: none;
  }
`;

export default GlobalStyle;
