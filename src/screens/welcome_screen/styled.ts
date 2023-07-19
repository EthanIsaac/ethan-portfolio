import { styled } from '@mui/material';
import { DURATION_WELCOME_SCREEN } from '../../utils/constants/durations';

export const WelcomeScreenContainer = styled('div')`
  flex: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
`;

export const WelcomeScreenBackground = styled('div')<{ visible: boolean }>`
  position: absolute;
  width: 100%;
  height: 100%;
  background: ${(props) => props.theme.palette.primary.dark};
  z-index: 100;
  transition: opacity 2s ease-in;
  opacity: 1;

  ${(props) =>
    !props.visible &&
    `
  pointer-events: none;
  opacity: 0;
  `}
`;

export const WelcomeMessage = styled('div')<{ visible: boolean }>`
  animation: bounceInDown;
  animation-duration: ${DURATION_WELCOME_SCREEN};
  text-align: center;

  ${(props) =>
    !props.visible &&
    `
  animation: backOutUp;
  animation-duration: ${DURATION_WELCOME_SCREEN};
  `}
`;
