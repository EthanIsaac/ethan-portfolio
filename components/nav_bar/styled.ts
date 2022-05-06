import styled from 'styled-components';

export const NavBarContainer = styled.div<{ variant: boolean }>`
  position: fixed;
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  z-index: 5;

  transition: all ${(props) => props.theme.fixedValues.navBarTransitionDuration};

  & * {
    transition: all ${(props) => props.theme.fixedValues.navBarTransitionDuration};
  }

  height: ${(props) => props.theme.fixedValues.navBarHeight};
  background-color: white;
  box-shadow: 0px 2px 10px ${(props) => props.theme.colors.shadow};

  & > img {
    height: 100%;
    width: auto;
    cursor: pointer;
  }

  ${(props) =>
    props.variant &&
    `
    height: calc(${props.theme.fixedValues.navBarHeight} - 0.5em);
    box-shadow: none;
    background-color: transparent;
  `}
`;
