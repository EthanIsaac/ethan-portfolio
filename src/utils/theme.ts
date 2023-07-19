import { createTheme } from '@mui/material';
import { League_Spartan } from 'next/font/google';
import { COLOR_PRIMARY, COLOR_PRIMARY_DARK, COLOR_PRIMARY_LIGHT } from './constants/colors';

const leagueSpartan = League_Spartan({ subsets: ['latin'] });

export const theme = createTheme({
  typography: {
    fontFamily: leagueSpartan.style.fontFamily,
  },
  palette: {
    primary: {
      main: COLOR_PRIMARY,
      contrastText: 'white',
      light: COLOR_PRIMARY_LIGHT,
      dark: COLOR_PRIMARY_DARK,
    },
  },
});

export default theme;
