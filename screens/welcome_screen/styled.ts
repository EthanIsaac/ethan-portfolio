import styled, { keyframes } from 'styled-components';

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

export const WelcomeScreenContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
`;

export const WelcomeScreenBackground = styled.div<{ visible: boolean }>`
  position: absolute;
  width: 100%;
  height: 100%;
  background: ${(props) => props.theme.gradients.primary};
  z-index: 100;
  transition: opacity 1s;
  opacity: 1;

  ${(props) =>
    !props.visible &&
    `
  pointer-events: none;
  opacity: 0;
  `}
`;

export const WelcomeMessage = styled.div`
  animation: bounceInDown;
  animation-duration: 2s;
  text-align: center;
`;
