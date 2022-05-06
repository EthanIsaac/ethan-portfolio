import { DefaultTheme } from 'styled-components';
import {
  COLOR_PRIMARY,
  COLOR_PRIMARY_DARK,
  COLOR_PRIMARY_DARKEST,
  COLOR_PRIMARY_LIGHT,
  COLOR_SHADOW,
} from './constants/colors';
import { GRADIENT_PRIMARY } from './constants/gradients';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: Record<string, string>;
    gradients: Record<string, string>;
  }
}

const theme: DefaultTheme = {
  colors: {
    primary: COLOR_PRIMARY,
    primaryLight: COLOR_PRIMARY_LIGHT,
    primaryDark: COLOR_PRIMARY_DARK,
    primaryDarkest: COLOR_PRIMARY_DARKEST,
    shadow: COLOR_SHADOW,
  },
  gradients: {
    primary: GRADIENT_PRIMARY,
  },
};

export default theme;
