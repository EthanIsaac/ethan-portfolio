import styled from 'styled-components';
import { NAV_BAR_HEIGHT } from '../../../utils/constants/component_sizes';
import { desktopCss, mobileCss } from '../../../utils/constants/responsiveness';

export const SectionsListContainer = styled.div<{ isOpen?: boolean }>`
  width: 100%;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: right;

  ${(props) => `
  ${mobileCss(`
    position: absolute;
    top: 0;
    left: 0;
    overflow: hidden;
    height: ${props.isOpen ? `100vh` : '0px'};
    width: 100vw;
    background: white;
    ${props.isOpen && `padding-top: ${NAV_BAR_HEIGHT};`}
    padding-right: 1rem;
    box-sizing: border-box;
    flex-direction: column;`)}
    z-index: -1;
  `}
`;

export const SectionTitle = styled.span.attrs({ align: 'center' })<{
  index: number;
  variant: boolean;
  active: boolean;
}>`
  font-size: ${(props) => props.theme.fontStyle.sizes.sm};
  cursor: pointer;
  animation: backInDown 1s;
  animation-delay: ${(props) => props.index * 0.2}s;
  animation-fill-mode: both;
  text-align: center;

  transition: all 1s;

  margin-right: 2rem;

  ${(props) => `  
  color: ${props.theme.colors.primary};
  margin-bottom: 3px;

  ${desktopCss(`
  ${props.variant ? `color: white;` : ''}
  ${props.active ? `border-bottom: 2px solid ${props.variant ? 'white' : props.theme.colors.primary};` : ''}
    transition: margin-bottom 0.3s !important;
    :hover {
      margin-bottom: 10px;
    }
  `)}

  ${mobileCss(`
    width: 100%;
    padding: 1rem;
    margin-bottom: 1em;
    display: flex;
    justify-content: flex-end;
    `)}
  `}
`;
