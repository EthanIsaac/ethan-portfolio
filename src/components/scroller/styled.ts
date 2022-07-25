import styled from "styled-components";
import { NAV_BAR_HEIGHT } from "../../utils/constants/component_sizes";
import { desktopCss } from "../../utils/constants/responsiveness";

export const ScrollerContainer = styled.div`
  position: relative;
  top: ${NAV_BAR_HEIGHT};
`;

export const ContentContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1;
  box-sizing: border-box;
  width: 96vw;
  ${desktopCss(`
  height: calc(100% - 4vh - ${NAV_BAR_HEIGHT});
  `)}
  margin: 2vh 2vw;
  background: rgba(0, 0, 0, 0.5);
  border: white 2px solid;
  border-radius: 20px;
  box-shadow: 0px 0px 50px black;
`;

export const ScrollSectionContainer = styled.div`
  ${desktopCss(
    `
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    cursor: grab;
    `,
  )}
  padding: 2vh 5vw;
`;
