import styled from 'styled-components';
import { desktopCss, mobileCss } from '../../utils/constants/responsiveness';

export const AboutMeContainer = styled.section``;

export const Overview = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 20px;
`;

export const AvatarPicture = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  & > img {
    border-radius: 50%;
    box-shadow: 0px 0px 50px black;
    height: 25vmin;
    max-height: 500px;
    min-height: 150px;
  }
`;

export const Quote = styled.div`
  margin-top: 2rem;
  font-style: italic; bold;
`;

export const Description = styled.div`
  padding: 1rem;
  flex: 5;
  min-width: 60vw;
  font-size: ${({ theme }) => theme.fontStyle.sizes.m};

  ${desktopCss(`
    margin-left: 2rem;
  `)}

  ${mobileCss(`
    padding: 0;
    padding-top: 1rem;
  `)}
`;

export const Title = styled.div`
  font-size: ${({ theme }) => theme.fontStyle.sizes.xxl};
  text-shadow: 0px 0px 10px white;
`;

export const Subtitle = styled.div`
  font-size: ${({ theme }) => theme.fontStyle.sizes.sm};
  font-style: italic;
  text-shadow: 0px 0px 5px white;
`;

export const Bio = styled.div`
  font-size: ${({ theme }) => theme.fontStyle.sizes.sm};
`;
