import styled from "styled-components";
import { mobileCss } from "utils/constants/responsiveness";

export const SkillsSwiperContainer = styled.div`
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

  border-radius: 50%;
  width: 90px;
  height: 90px;

  & > img {
    margin: auto;
    display: block;
    width: auto;
    height: auto;
    max-width: 80px;
    max-height: 80px;
  }

  ${mobileCss(`
  width: 5.5em;
  height: 5.5em;
  & > img {
    max-width: 3.5em;
    max-height: 3.5em;
  }
  `)}
`;
