import { SkillsSwiper } from "./skills_swiper";
import { SkillsContainer } from "./styles";

const Skills = () => {
  return (
    <SkillsContainer>
      <h1>Databases</h1>
      <SkillsSwiper
        items={[
          <img src="/assets/images/skills/databases/javascript.svg" />,
          <img src="/assets/images/skills/go.svg" />,
        ]}
      />
      <h1>Programming languages</h1>
      <SkillsSwiper
        items={[<img src="/assets/images/skills/javascript.svg" />, <img src="/assets/images/skills/go.svg" />]}
      />
      <h1>DevOps</h1>
      <SkillsSwiper reversed items={[<img src="/assets/images/skills/docker.png" />]} />
    </SkillsContainer>
  );
};

export default Skills;
