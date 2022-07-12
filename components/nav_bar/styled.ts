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

export const SectionsListContainer = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: right;
`;

export const SectionTitle = styled.span<{ index: number; variant: boolean; active: boolean }>`
  font-size: 1.4em;
  cursor: pointer;
  margin: 0 0.5em;
  animation: backInDown 1s;
  animation-delay: ${(props) => props.index * 0.2}s;
  animation-fill-mode: both;

  transition: all 1s;

  ${(props) =>
    props.variant
      ? `
      text-shadow: 0px 2px 5px ${props.theme.colors.shadow};
      :hover {
        text-shadow: 0px 0px 10px white;
      }
      ${props.active && `text-decoration: underline white;`}
  `
      : `
      text-shadow: 0px 2px 5px ${props.theme.colors.shadow};
      :hover {
        text-shadow: 0px 0px 10px ${props.theme.colors.primary};
      }
      color: ${props.theme.colors.primary};

      ${props.active && `text-decoration: underline ${props.theme.colors.primary};`}
`}
`;
