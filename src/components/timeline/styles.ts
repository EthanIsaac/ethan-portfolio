import { styled } from '@mui/material';
import { desktopCss, mobileCss } from 'utils/constants/responsiveness';

export const TimelineContainer = styled('div')`
  display: flex;
  height: 100%;
  width: 100%;
  align-items: center;
  flex-direction: column;

  ${mobileCss(`
  flex-direction: row;
  min-height: 800px;
  height: 10vh;
  `)}
`;

export const ContentContainer = styled('div')`
  flex: 1;
  height: 100%;
  background: rgba(255, 255, 255, 0.2);
  padding: 2rem;
  box-sizing: border-box;
  border-radius: 20px;

  ${desktopCss(`    
    min-height: 300px;
    width: 100%;
    margin-bottom: 2rem;
  `)}

  ${mobileCss(`
    min-width: 300px;
    height: 100%;
    margin-left: 2rem;
  `)}
`;

export const EventsContainer = styled('div')`
  display: flex;
  align-items: center;

  ${desktopCss(`
    width: 100%;
  `)}

  ${mobileCss(`
    flex-direction: column;
    height: 100%;
  `)}
`;

export const Event = styled('img')<{ isActive: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid white;
  padding: 8px;
  cursor: pointer;

  ${(props) =>
    `
    ${desktopCss(`
      margin: 20px 0px;
      ${props.isActive ? 'margin-top: 0px;' : ''}
    `)}

    ${mobileCss(`
      margin: 0px 20px;
      ${props.isActive ? 'margin-right: 0px;' : ''}
    `)}

    ${props.isActive ? 'box-shadow: 0px 0px 30px white;' : ''}
  `}

  transition: all 0.2s;
`;

export const Separator = styled('div')`
  flex: 1;
  background: white;
  height: 2px;
  margin: 0px 10px;

  ${mobileCss(`
    height: 0px;
    width: 2px;
    margin: 10px 0px;
  `)}
`;
