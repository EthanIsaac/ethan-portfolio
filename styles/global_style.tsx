import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  html,
  body {
    padding: 0;
    margin: 0;
    color: white;
    font-family: 'Unna', serif;

    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
    ::-webkit-scrollbar {
      display: none;
    }

    h1 {
      font-size: 5vw;
    }

    h2 {
      font-size: 3vw;
    }
  }
`;

export default GlobalStyle;
