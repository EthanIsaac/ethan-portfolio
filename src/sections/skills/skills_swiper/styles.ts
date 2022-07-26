import styled from "styled-components";

export const SkillsSwiperContainer = styled.div`
  height: 200px;
  max-width: 100%;
`;

export const Slide = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 130px;
  height: 130px;
  background: white;
  border-radius: 50%;

  & > img {
    margin: auto;
    display: block;
    max-width: 200px;
    max-height: 70px;
    width: auto;
    height: auto;
  }
`;
