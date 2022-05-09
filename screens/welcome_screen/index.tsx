import React, { useState } from 'react';
import { WelcomeMessage, WelcomeScreenBackground, WelcomeScreenContainer } from './styled';

interface WelcomeScreenProps {
  onAnimationEnd: () => void;
}

const WelcomeScreen = ({ onAnimationEnd }: WelcomeScreenProps) => {
  const [visible, setVisible] = useState(true);
  return (
    <WelcomeScreenBackground visible={visible}>
      <WelcomeScreenContainer>
        <WelcomeMessage
          onAnimationEnd={() => {
            setVisible(false);
            onAnimationEnd();
          }}
        >
          <h1>Welcome to my site!</h1>
          <h2>Ethan Bautista</h2>
        </WelcomeMessage>
      </WelcomeScreenContainer>
    </WelcomeScreenBackground>
  );
};

export default WelcomeScreen;
