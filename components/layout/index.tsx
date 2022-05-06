import { ComponentContainer, LayoutContainer } from './styled';
import { useState } from 'react';
import WelcomeScreen from '../../screens/welcome_screen';

const Layout = ({ children }) => {
  const [firstRender, setFirstRender] = useState(true);
  return (
    <LayoutContainer>
      <WelcomeScreen onAnimationEnd={() => setFirstRender(false)} />
      {!firstRender && <ComponentContainer>{children}</ComponentContainer>}
    </LayoutContainer>
  );
};

export default Layout;
