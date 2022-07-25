import { SkillsSwiper } from "./skills_swiper";
import { SkillsContainer } from "./styles";

const Skills = () => {
  return (
    <SkillsContainer>
      <SkillsSwiper
        items={[
          <img src="/assets/images/skills/docker.png" />,
          <img src="/assets/images/skills/javascript.svg" />,
          <img src="/assets/images/skills/go.svg" />,
          <img src="/assets/images/skills/docker.png" />,
          <img src="/assets/images/skills/docker.png" />,
          <img src="/assets/images/skills/docker.png" />,
          <img src="/assets/images/skills/docker.png" />,
          <img src="/assets/images/skills/docker.png" />,
        ]}
      />
      <SkillsSwiper
        reversed
        items={[
          <img src="/assets/images/skills/docker.png" />,
          <img src="/assets/images/skills/docker.png" />,
          <img src="/assets/images/skills/docker.png" />,
          <img src="/assets/images/skills/docker.png" />,
        ]}
      />
    </SkillsContainer>
  );
};

export default Skills;
