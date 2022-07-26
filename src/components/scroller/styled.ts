import styled from "styled-components";
import { NAV_BAR_HEIGHT } from "utils/constants/component_sizes";
import { desktopCss, mobileCss } from "../../utils/constants/responsiveness";

export const ScrollerContainer = styled.div`
  flex: 1;
  ${mobileCss(`
  margin-top: ${NAV_BAR_HEIGHT};
  `)}
  display: flex;
  flex-direction: column;
`;

export const ContentContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1;
  box-sizing: border-box;
  width: 96vw;
  height: 100%;
  margin: 2vh 2vw;
  background: rgba(0, 0, 0, 0);
  border-radius: 20px;
  box-shadow: 0px 0px 150px black;
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
