import styled from "styled-components";
import { NAV_BAR_HEIGHT } from "../../utils/constants/component_sizes";

export const ScrollerContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1;
  box-sizing: border-box;
  top: ${NAV_BAR_HEIGHT};
  height: calc(100% - 4vh - ${NAV_BAR_HEIGHT});
  margin: 2vh 2vw;
  background: rgba(0, 0, 0, 0.5);
  border: white 2px solid;
  border-radius: 20px;
  box-shadow: 0px 0px 50px black;
`;

export const ScrollSectionContainer = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  cursor: grab;
  padding: 2vh 2vw;
`;
