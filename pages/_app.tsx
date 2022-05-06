import { ThemeProvider } from 'styled-components';
import Layout from '../components/layout';
import GlobalStyle from '../styles/global_style';
import theme from '../utils/theme';
export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  );
}
