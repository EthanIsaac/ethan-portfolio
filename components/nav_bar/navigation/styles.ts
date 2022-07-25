import { isMobile } from "react-device-detect";
import styled from "styled-components";
import { NAV_BAR_HEIGHT } from "../../../utils/constants/component_sizes";

export const SectionsListContainer = styled.div<{ isOpen?: boolean }>`
  width: 100%;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: right;

  ${(props) => `
  ${
    isMobile &&
    `
  
  position: absolute;
  top: ${NAV_BAR_HEIGHT};
  left: 0;
  overflow: hidden;
  height: ${props.isOpen ? `calc(100vh - ${NAV_BAR_HEIGHT})` : "0px"};
  width: 100vw;
  background: white;
  flex-direction: column;
  `
  }
  `}
`;

export const SectionTitle = styled.span<{ index: number; variant: boolean; active: boolean }>`
  font-size: 1.4em;
  cursor: pointer;
  margin: 0 0.5em;
  animation: backInDown 1s;
  animation-delay: ${(props) => props.index * 0.2}s;
  animation-fill-mode: both;

  transition: all 1s;

  ${isMobile &&
  `
  width: 100%;
  padding: 1rem;
  padding-right: 50px;
  display: flex;
  justify-content: flex-end;
  `}

  ${(props) =>
    props.variant && !isMobile
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
