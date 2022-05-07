import { NavBarContainer } from './styled';

const NavBar = ({ currentSection }) => {
  return (
    <NavBarContainer variant={currentSection != 0}>
      <img src="assets/images/coder.png"></img>
    </NavBarContainer>
  );
};

export default NavBar;
