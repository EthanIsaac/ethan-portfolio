import { ReactNode, useEffect, useState } from 'react';
import { WithFadeContainer } from './styled';

interface WithFadeProps {
  children: ReactNode;
  visible: boolean;
}

const WithFade = ({ children, visible }: WithFadeProps) => {
  const [isVisible, setIsVisible] = useState(visible);

  const handleAnimationEnd = () => {
    if (!visible) {
      setIsVisible(false);
    }
  };

  const handleAnimationStart = () => {
    if (visible) {
      setIsVisible(true);
    }
  };

  useEffect(handleAnimationStart, [visible]);

  if (!isVisible) {
    return null;
  }

  return (
    <WithFadeContainer visible={visible} onAnimationEnd={handleAnimationEnd} onAnimationStart={handleAnimationStart}>
      {children}
    </WithFadeContainer>
  );
};

export default WithFade;
