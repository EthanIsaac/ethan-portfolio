import Navigation from "./navigation";
import { MobileHamburgerContainer, NavBarContainer } from "./styled";
import { GiHamburgerMenu } from "react-icons/gi";
import { useState } from "react";
import useIsMobile from "../../hooks/useIsMobile";

const NavBar = ({ currentSection, sections, onTitleClick }) => {
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const variant = !isMobile && currentSection != 0;

  const handleSectionClick = (i: number) => {
    if (isMobile) {
      document.getElementById(`section-${i}`).scrollIntoView({ behavior: "smooth", block: i === 0 ? "end" : "start" });
    }
    onTitleClick(i);
  };

  return (
    <NavBarContainer variant={variant}>
      <button onClick={() => handleSectionClick(0)}>
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
        onTitleClick={handleSectionClick}
        closeMenu={() => setIsMenuOpen(false)}
      />
    </NavBarContainer>
  );
};

export default NavBar;
