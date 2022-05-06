import styled from 'styled-components';

export const LoadingScreenContainer = styled.div<{ visible: boolean }>`
  display: flex;
  flex-direction: column;
  position: absolute;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.theme.colors.primaryDark};
  z-index: 99;
  transition: opacity 1s;
  opacity: 1;

  ${(props) =>
    !props.visible &&
    `
  pointer-events: none;
  opacity: 0;
  `}
`;
