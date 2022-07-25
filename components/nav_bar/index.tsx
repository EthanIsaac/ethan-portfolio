import { isMobile } from "react-device-detect";
import Navigation from "./navigation";
import { MobileHamburgerContainer, NavBarContainer } from "./styled";
import { GiHamburgerMenu } from "react-icons/gi";
import { useState } from "react";

const NavBar = ({ currentSection, sections, onTitleClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const variant = currentSection != 0;

  return (
    <NavBarContainer variant={variant}>
      <button onClick={() => onTitleClick(0)}>
        <img src="assets/images/coder.png"></img>
      </button>
      {isMobile && (
        <MobileHamburgerContainer variant={variant}>
          <GiHamburgerMenu onClick={() => setIsMenuOpen(!isMenuOpen)} />
        </MobileHamburgerContainer>
      )}
      <Navigation
        isOpen={isMenuOpen}
        variant={variant}
        currentSection={currentSection}
        sections={sections}
        onTitleClick={onTitleClick}
        closeMenu={() => setIsMenuOpen(false)}
      />
    </NavBarContainer>
  );
};

export default NavBar;
