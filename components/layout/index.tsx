import theme from '../../utils/theme';
import { ComponentContainer, LayoutContainer } from './styled';
import { ThemeProvider } from 'styled-components';
import NavBar from '../nav_bar';
import Footer from '../footer';

const Layout = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <LayoutContainer>
        <NavBar />
        <ComponentContainer>{children}</ComponentContainer>
        <Footer />
      </LayoutContainer>
    </ThemeProvider>
  );
};

export default Layout;
