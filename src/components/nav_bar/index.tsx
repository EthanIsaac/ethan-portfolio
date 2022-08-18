import Navigation from './navigation';
import { MobileHamburgerContainer, NavBarContainer } from './styled';
import { GiHamburgerMenu } from 'react-icons/gi';
import { useState } from 'react';
import useIsMobile from '../../hooks/useIsMobile';
import SocialMedia from './social_media';

const NavBar = ({ currentSection, sections, onTitleClick }) => {
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const variant = !isMobile && currentSection != 0;

  const handleSectionClick = (i: number) => {
    if (isMobile) {
      document.getElementById(`section-${i}`).scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    onTitleClick(i);
  };

  return (
    <NavBarContainer variant={variant || isMobile}>
      {isMobile && (
        <MobileHamburgerContainer isOpen={isMenuOpen}>
          <GiHamburgerMenu onClick={() => setIsMenuOpen(!isMenuOpen)} />
        </MobileHamburgerContainer>
      )}
      {!isMobile && <SocialMedia />}
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
