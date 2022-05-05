import theme from '../../utils/theme';
import { ComponentContainer, LayoutContainer } from './styled';
import { ThemeProvider } from 'styled-components';
import NavBar from '../nav_bar';
import Footer from '../footer';
import Background from '../background';

const Layout = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <LayoutContainer>
        <Background />
        <NavBar />
        <ComponentContainer>{children}</ComponentContainer>
        <Footer />
      </LayoutContainer>
    </ThemeProvider>
  );
};

export default Layout;
