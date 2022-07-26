import styled from "styled-components";
import { mobileCss } from "utils/constants/responsiveness";

export const SkillsSwiperContainer = styled.div`
  height: 200px;
  max-width: 100%;

  .swiper-slide {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export const Slide = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  background: white;
  border-radius: 50%;
  width: 8vw;
  height: 8vw;

  ${mobileCss(`
  width: 5.5em;
  height: 5.5em;
  `)}

  & > img {
    margin: auto;
    display: block;
    width: auto;
    height: auto;
    max-width: 5vw;
    max-height: 5vw;

    ${mobileCss(`
    max-width: 3.5em;
    max-height: 3.5em;
    `)}
  }
`;
