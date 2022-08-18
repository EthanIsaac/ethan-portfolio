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

export const SectionTitle = styled.div.attrs({ align: 'center' })<{
  index: number;
  variant: boolean;
  active: boolean;
}>`
  font-size: ${(props) => props.theme.fontStyle.sizes.m};
  cursor: pointer;
  animation: backInDown 1s;
  animation-delay: ${(props) => props.index * 0.2}s;
  animation-fill-mode: both;
  text-align: center;

  transition: all 1s;

  margin-right: 2rem;

  ${mobileCss(`
  width: 100%;
  padding: 1rem;
  margin-bottom: 1em;
  display: flex;
  justify-content: flex-end;
  `)}

  ${(props) => `  
  text-shadow: 0px 2px 5px ${props.theme.colors.shadow};
  :hover {
    text-shadow: 0px 0px 10px ${props.theme.colors.primary};
  }
  color: ${props.theme.colors.primary};
  `}

  ${(props) => props.active && desktopCss(`text-decoration: underline ${props.theme.colors.primary};`)}

  ${(props) =>
    props.variant &&
    desktopCss(`
    color: white;
    text-shadow: 0px 2px 5px ${props.theme.colors.shadow};
    :hover {
      text-shadow: 0px 0px 10px white;
    }
    ${props.active && `text-decoration: underline white;`}
`)}
`;
