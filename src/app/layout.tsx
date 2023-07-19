'use client';

import theme from 'utils/theme';
import { useState } from 'react';
import WelcomeScreen from 'screens/welcome_screen';
import { GlobalStyles, ThemeProvider } from '@mui/material';
import GlobalStyle from 'styles/global_style';
import 'animate.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [firstRender, setFirstRender] = useState(true);
  return (
    <html lang='en'>
      <head></head>
      <body>
        <ThemeProvider theme={theme}>
          <GlobalStyles styles={GlobalStyle} />
          <WelcomeScreen onAnimationEnd={() => setFirstRender(false)} />
          {!firstRender && children}
        </ThemeProvider>
      </body>
    </html>
  );
}
