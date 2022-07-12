import { createGlobalStyle } from "styled-components";
import { blurIn, blurOut } from "../animations/blur";
import { isMobile } from "react-device-detect";

const GlobalStyle = createGlobalStyle`
  html,
  body {
    padding: 0;
    margin: 0;
    color: white;
    font-weight: 400;
    font-size: 16px;

    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
    ::-webkit-scrollbar {
      display: none;
    }

    h1 {
      ${
        isMobile
          ? `
      font-size: 2rem;
      `
          : `
      font-size: 4rem;
      `
      }
    }

    h2 {
      ${isMobile ? "font-size: 1.5rem;" : "font-size: 3rem;"}
    }

    h3 {
      ${isMobile ? "font-size: 1rem;" : "font-size: 2rem;"}
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
