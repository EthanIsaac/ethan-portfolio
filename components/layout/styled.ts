import styled from 'styled-components';

export const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  position: relative;
`;

export const ComponentContainer = styled.div`
  margin-top: ${(props) => props.theme.fixedValues.navBarHeight};
  flex: 1;
`;
