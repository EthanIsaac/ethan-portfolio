import { createGlobalStyle } from 'styled-components';
import { blurIn, blurOut } from '../animations/blur';

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

    .no-select {
      -webkit-touch-callout: none; /* iOS Safari */
        -webkit-user-select: none; /* Safari */
         -khtml-user-select: none; /* Konqueror HTML */
           -moz-user-select: none; /* Old versions of Firefox */
            -ms-user-select: none; /* Internet Explorer/Edge */
                user-select: none; /* Non-prefixed version, currently
                                      supported by Chrome, Edge, Opera and Firefox */
    }

    ${blurIn}
    ${blurOut}
  }
`;

export default GlobalStyle;
