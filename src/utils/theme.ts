import { createTheme } from '@mui/material';
import { League_Spartan } from 'next/font/google';
import { COLOR_PRIMARY, COLOR_PRIMARY_DARK, COLOR_PRIMARY_LIGHT, COLOR_WHITE } from './constants/colors';

const leagueSpartan = League_Spartan({ subsets: ['latin'] });

export const theme = createTheme({
  typography: {
    fontFamily: leagueSpartan.style.fontFamily,
  },
  palette: {
    mode: 'dark',
    primary: {
      main: COLOR_PRIMARY,
      contrastText: COLOR_WHITE,
      light: COLOR_PRIMARY_LIGHT,
      dark: COLOR_PRIMARY_DARK,
    },
    secondary: {
      main: COLOR_WHITE,
      contrastText: COLOR_PRIMARY,
      light: COLOR_PRIMARY_LIGHT,
      dark: COLOR_PRIMARY_DARK,
    },
  },
});

export default theme;
