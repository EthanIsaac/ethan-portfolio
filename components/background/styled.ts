import styled from 'styled-components';

export const BackgroundContainer = styled.div`
  position: absolute;
  z-index: -1;
  width: 100%;
  height: 100%;
  background-color: ${(props) => props.theme.colors.primaryDark};
`;
