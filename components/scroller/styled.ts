import styled from 'styled-components';
import { NAV_BAR_HEIGHT } from '../../utils/constants/component_sizes';

export const ScrollerContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  flex: 1;
  overflow: hidden;
  cursor: grab;
  margin-top: ${NAV_BAR_HEIGHT};
`;

export const ScrollSectionContainer = styled.div`
  flex: 0 0 100%;
  padding: 2vh 1vw;
  box-sizing: border-box;
`;
