import styled from "styled-components";
import { NAV_BAR_HEIGHT } from "../../utils/constants/component_sizes";
import { DURATION_NAV_BAR_TRANSITION } from "../../utils/constants/durations";

export const NavBarContainer = styled.div<{ variant: boolean }>`
  display: flex;
  position: fixed;
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  z-index: 5;

  transition: all ${DURATION_NAV_BAR_TRANSITION};

  & * {
    transition: all ${DURATION_NAV_BAR_TRANSITION};
  }

  height: ${NAV_BAR_HEIGHT};
  background-color: white;
  box-shadow: 0px 2px 10px ${(props) => props.theme.colors.shadow};

  & > button {
    height: 100%;
    width: auto;
    background: none;
    border: none;
    cursor: pointer;

    > img {
      height: 100%;
      width: auto;
    }
  }

  ${(props) =>
    props.variant &&
    `
    height: calc(${NAV_BAR_HEIGHT} - 0.5em);
    box-shadow: none;
    background-color: transparent;
  `}
`;

export const MobileHamburgerContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;

  & > svg {
    color: ${(props) => props.theme.colors.primary};
    height: 100%;
    width: 25px;
  }
`;
