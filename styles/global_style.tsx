import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  html,
  body {
    padding: 0;
    margin: 0;
    color: white;
    font-weight: 400;

    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
    ::-webkit-scrollbar {
      display: none;
    }

    h1 {
      font-size: 5em;
    }

    h2 {
      font-size: 3em;
    }

    h3 {
      font-size: 2em;
    }

    h4 {
      font-size: 1.3em;
    }

    h5 {
      font-size: 1em;
    }
  }
`;

export default GlobalStyle;
