import Layout from "components/layout";
import { SkillsSwiper } from "./skills_swiper";
import { SkillsContainer, SwiperContainer } from "./styles";

const Skills = () => {
  return (
    <Layout>
      <SkillsContainer>
        <SwiperContainer>
          <h3>Programming languages</h3>
          <SkillsSwiper
            items={[
              <img src="/assets/images/skills/programming-languages/typescript.svg" />,
              <img src="/assets/images/skills/programming-languages/javascript.svg" />,
              <img src="/assets/images/skills/programming-languages/go.svg" />,
              <img src="/assets/images/skills/programming-languages/dart.svg" />,
              <img src="/assets/images/skills/programming-languages/java.svg" />,
              <img src="/assets/images/skills/programming-languages/php.svg" />,
              <img src="/assets/images/skills/programming-languages/python.svg" />,
              <img src="/assets/images/skills/programming-languages/ruby.svg" />,
            ]}
          />
        </SwiperContainer>
        <SwiperContainer>
          <h3>Databases</h3>
          <SkillsSwiper
            reversed
            items={[
              <img src="/assets/images/skills/databases/firebase.svg" />,
              <img src="/assets/images/skills/databases/mongodb.svg" />,
              <img src="/assets/images/skills/databases/mysql.svg" />,
              <img src="/assets/images/skills/databases/postgresql.svg" />,
              <img src="/assets/images/skills/databases/redis.svg" />,
            ]}
          />
        </SwiperContainer>
        <SwiperContainer>
          <h3>Frameworks</h3>
          <SkillsSwiper
            items={[
              <img src="/assets/images/skills/frameworks/express.svg" />,
              <img src="/assets/images/skills/frameworks/flutter.svg" />,
              <img src="/assets/images/skills/frameworks/jest.svg" />,
              <img src="/assets/images/skills/frameworks/nextjs.svg" />,
              <img src="/assets/images/skills/frameworks/nginx.svg" />,
              <img src="/assets/images/skills/frameworks/nodejs.svg" />,
              <img src="/assets/images/skills/frameworks/react.svg" />,
              <img src="/assets/images/skills/frameworks/redux.svg" />,
              <img src="/assets/images/skills/frameworks/selenium.svg" />,
              <img src="/assets/images/skills/frameworks/threejs.svg" />,
            ]}
          />
        </SwiperContainer>
        <SwiperContainer>
          <h3>Tools</h3>
          <SkillsSwiper
            reversed
            items={[
              <img src="/assets/images/skills/tools/aws.svg" />,
              <img src="/assets/images/skills/tools/babel.svg" />,
              <img src="/assets/images/skills/tools/docker.svg" />,
              <img src="/assets/images/skills/tools/git.svg" />,
              <img src="/assets/images/skills/tools/github.svg" />,
              <img src="/assets/images/skills/tools/gitlab.svg" />,
              <img src="/assets/images/skills/tools/google-cloud.svg" />,
              <img src="/assets/images/skills/tools/jira.svg" />,
              <img src="/assets/images/skills/tools/kubernetes.svg" />,
              <img src="/assets/images/skills/tools/npm.svg" />,
              <img src="/assets/images/skills/tools/slack.svg" />,
              <img src="/assets/images/skills/tools/travis.svg" />,
              <img src="/assets/images/skills/tools/vscode.svg" />,
              <img src="/assets/images/skills/tools/webpack.svg" />,
              <img src="/assets/images/skills/tools/xcode.svg" />,
              <img src="/assets/images/skills/tools/yarn.svg" />,
            ]}
          />
        </SwiperContainer>
      </SkillsContainer>
    </Layout>
  );
};

export default Skills;
