import styled from 'styled-components';
import { desktopCss, mobileCss } from 'utils/constants/responsiveness';

export const SocialMediaContainer = styled.div`
  display: flex;
  align-items: flex-end;
  width: 100%;
  box-sizing: border-box;
  align-items: center;

  ${mobileCss(`
  justify-content: flex-end;
  `)}
`;

export const SocialMediaItem = styled.a`
  cursor: pointer;
  display: flex;

  ${desktopCss(`
    margin-right: 2vw;
  `)}

  ${mobileCss(`
    margin-left: 2vw;
  `)}

  align-items: center;

  img {
    width: 30px;
  }
`;
