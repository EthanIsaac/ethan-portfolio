import styled from "styled-components";

export const AboutMeContainer = styled.section``;

export const Overview = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 20px;
`;

export const AvatarPicture = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;

  & > img {
    border-radius: 50%;
    box-shadow: 0px 0px 50px black;
    height: 25vmin;
    max-height: 500px;
    min-height: 150px;
  }
`;

export const Description = styled.div`
  padding: 20px;
  flex: 5;
  min-width: 60vw;
  font-size: ${({ theme }) => theme.fontStyle.sizes.m};
`;

export const Title = styled.div`
  font-size: ${({ theme }) => theme.fontStyle.sizes.xxl};
  text-shadow: 0px 0px 10px white;
`;

export const Subtitle = styled.div`
  font-size: ${({ theme }) => theme.fontStyle.sizes.m};
  text-shadow: 0px 0px 10px white;
`;

export const Bio = styled.div`
  font-size: ${({ theme }) => theme.fontStyle.sizes.sm};
`;
