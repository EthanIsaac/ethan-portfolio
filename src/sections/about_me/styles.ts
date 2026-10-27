import styled from 'styled-components';
import { desktopCss, landscapeCss, mobileCss } from '../../utils/constants/responsiveness';

export const AboutMeContainer = styled.section`
  display: flex;
  height: 100%;
`;

export const Overview = styled.div`
  display: flex;

  ${mobileCss(`
  
  flex-direction: column;
  `)}

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
  display: flex;
  flex-direction: column;
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
  text-shadow: 0px 0px 20px black;
`;

export const Subtitle = styled.div`
  font-size: ${({ theme }) => theme.fontStyle.sizes.sm};
  font-style: italic;
  text-shadow: 0px 0px 10px black;
`;

export const Bio = styled.div`
  font-size: ${({ theme }) => theme.fontStyle.sizes.sm};
`;

export const PreviousProjects = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex: 1;

  & > div {
    flex: 33%;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: 25vmin;
      max-width: 150px;
      min-width: 50px;
    }
  }
`;
