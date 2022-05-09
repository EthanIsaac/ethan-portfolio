import styled from 'styled-components';
import { NAV_BAR_HEIGHT } from '../../utils/constants/component_sizes';

export const ScrollerContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export const ScrollSectionContainer = styled.div`
  width: 100%;
  height: calc(100% - ${NAV_BAR_HEIGHT});
  padding: 2vh 1vw;
  box-sizing: border-box;
  position: absolute;
  margin-top: ${NAV_BAR_HEIGHT};
  cursor: grab;
`;
