import { ThemeProvider } from "styled-components";
import GlobalStyle from "styles/global_style";
import theme from "utils/theme";
import { useState } from "react";
import WelcomeScreen from "screens/welcome_screen";
export default function App({ Component, pageProps }) {
  const [firstRender, setFirstRender] = useState(true);
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <WelcomeScreen onAnimationEnd={() => setFirstRender(false)} />
      {!firstRender && <Component {...pageProps} />}
    </ThemeProvider>
  );
}
