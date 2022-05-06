import { NavBarContainer } from './styled';

const NavBar = ({ currentSection }) => {
  return (
    <NavBarContainer variant={currentSection != 0}>
      <img
        src="assets/images/coder.png"
        onClick={() =>
          window.scrollTo({
            top: 0,
            behavior: 'smooth',
          })
        }
      ></img>
    </NavBarContainer>
  );
};

export default NavBar;
