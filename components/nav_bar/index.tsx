import { useEffect, useState } from 'react';
import { NavBarContainer } from './styled';

const NavBar = () => {
  const [variant, setVariant] = useState(false);

  const handleScroll = (e) => {
    if (!variant && window.scrollY >= 200) {
      setVariant(true);
    } else if (variant && window.scrollY == 0) {
      setVariant(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });

  return (
    <NavBarContainer variant={variant}>
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
