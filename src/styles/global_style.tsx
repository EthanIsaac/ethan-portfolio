import { createGlobalStyle } from "styled-components";
import { blurIn, blurOut } from "../animations/blur";
import { mobileCss } from "../utils/constants/responsiveness";

const GlobalStyle = createGlobalStyle`
  html,
  body {
    padding: 0;
    margin: 0;
    color: white;
    font-weight: 400;
    font-size: 16px;
    overflow: hidden;

    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
    ::-webkit-scrollbar {
      display: none;
    }

    h1 {
      font-size: 4rem;
      ${mobileCss(`
      font-size: 2rem;
      `)}
    }

    h2 {
      font-size: 3rem;
      ${mobileCss(`
      font-size: 1.5rem;
      `)}
    }

    h3 {
      font-size: 2rem;
      ${mobileCss(`
      font-size: 1rem;
      `)}
    }

    h4 {
      font-size: 1.3rem;
    }

    h5 {
      font-size: 1rem;
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
