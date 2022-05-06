import styled from 'styled-components';

export const BackgroundContainer = styled.div`
  position: absolute;
  z-index: -1;
  width: 100%;
  height: 100%;
  background: ${(props) => props.theme.gradients.primary};
`;
