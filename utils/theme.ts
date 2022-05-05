import { DefaultTheme } from 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: Record<string, string>;
    fixedValues: Record<string, string>;
  }
}

const theme: DefaultTheme = {
  colors: {
    primary: '#673ab7',
    primaryLight: '#9a67ea',
    primaryDark: '#320b86',
    shadow: '#888888',
  },
  fixedValues: {
    navBarHeight: '4em',
    navBarTransitionDuration: '0.7s',
  },
};

export default theme;
