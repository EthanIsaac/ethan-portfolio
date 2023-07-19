'use client';
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
          visible={visible}
          onAnimationEnd={() => {
            setVisible(false);
            onAnimationEnd();
          }}
        >
          <h1>Welcome to my site!</h1>
          <h3>This site is still under development...</h3>
        </WelcomeMessage>
      </WelcomeScreenContainer>
    </WelcomeScreenBackground>
  );
};

export default WelcomeScreen;
