import styled from 'styled-components';
import { NAV_BAR_HEIGHT } from '../../utils/constants/component_sizes';

export const ScrollerContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-top: ${NAV_BAR_HEIGHT};
`;

export const ScrollableSection = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
  cursor: grab;
`;

export const ScrollSectionContainer = styled.div`
  flex: 0 0 100%;
  padding: 2vh 1vw;
  box-sizing: border-box;
`;

export const SectionsListContainer = styled.div`
  position: absolute;
  top: 10px;
  right: 1vw;
  width: auto;
  height: auto;
  display: flex;
`;

export const SectionTitle = styled.h4<{ index: number }>`
  font-size: 1.4em;
  cursor: pointer;
  margin: 0 0.5em;
  text-shadow: 0px 5px 5px ${(props) => props.theme.colors.shadow};
  display: inline-block;
  animation: backInDown 1s;
  animation-delay: ${(props) => props.index * 0.2}s;
  animation-fill-mode: both;
`;
