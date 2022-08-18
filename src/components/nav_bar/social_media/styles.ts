import styled from 'styled-components';
import { mobileCss } from 'utils/constants/responsiveness';

export const SocialMediaContainer = styled.div`
  display: flex;
  align-items: flex-end;
  width: 100%;
  padding: 0px 2rem;
  box-sizing: border-box;
  align-items: center;

  ${mobileCss(`
  justify-content: flex-end;
  `)}
`;

export const SocialMediaItem = styled.a`
  cursor: pointer;
  display: flex;
  margin: 0px 2vw;
  align-items: center;

  img {
    width: 35px;
  }
`;
