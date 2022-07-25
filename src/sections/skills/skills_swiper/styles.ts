import styled from "styled-components";

export const SkillsSwiperContainer = styled.div`
  height: 200px;
  max-width: 100%;
`;

export const Slide = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  & > img {
    margin: auto;
    display: block;
    max-width: 230px;
    max-height: 95px;
    width: auto;
    height: auto;
  }
`;
