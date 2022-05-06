import { ComponentContainer, LayoutContainer } from './styled';
import NavBar from '../nav_bar';
import Background from '../background';
import { useState } from 'react';
import WelcomeScreen from '../../screens/welcome_screen';
import LoadingScreen from '../../screens/loading_screen';

const Layout = ({ children }) => {
  const [firstRender, setFirstRender] = useState(true);
  return (
    <LayoutContainer>
      <WelcomeScreen onAnimationEnd={() => setFirstRender(false)} />
      <Background />
      <NavBar />
      {!firstRender && <ComponentContainer>{children}</ComponentContainer>}
    </LayoutContainer>
  );
};

export default Layout;
