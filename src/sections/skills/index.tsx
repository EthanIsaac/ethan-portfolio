import Layout from "components/layout";
import { SkillsSwiper } from "./skills_swiper";
import { SkillsContainer } from "./styles";

const Skills = () => {
  return (
    <Layout>
      <SkillsContainer>
        <h1>Databases</h1>
        <SkillsSwiper
          items={[
            <img src="/assets/images/skills/databases/firebase.svg" />,
            <img src="/assets/images/skills/databases/mongodb.svg" />,
            <img src="/assets/images/skills/databases/mysql.svg" />,
            <img src="/assets/images/skills/databases/postgresql.svg" />,
            <img src="/assets/images/skills/databases/redis.svg" />,
          ]}
        />
        <h1>Programming languages</h1>
        <SkillsSwiper
          items={[<img src="/assets/images/skills/javascript.svg" />, <img src="/assets/images/skills/go.svg" />]}
        />
        <h1>DevOps</h1>
        <SkillsSwiper reversed items={[<img src="/assets/images/skills/docker.png" />]} />
      </SkillsContainer>
    </Layout>
  );
};

export default Skills;
