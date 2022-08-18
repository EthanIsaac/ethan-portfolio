import Layout from 'components/layout';
import { AboutMeContainer, AvatarPicture, Description, Title, Overview, Subtitle, Bio, Quote } from './styles';

const AboutMe = () => {
  return (
    <Layout>
      <AboutMeContainer>
        <Overview>
          <AvatarPicture>
            <img src='/assets/images/ethan-avatar.jpg' />
            <Quote>
              — "Innovation is a process that requires effort and dedication. Talent without commitment does not
              generate progress"
            </Quote>
          </AvatarPicture>
          <Description>
            <Title>Ethan Isaac Bautista Trevizo</Title>
            <Subtitle>Passionate Leader and Entrepreneur</Subtitle>
            <Bio>
              <p>Hello there!</p>
              <p>
                My name's Ethan. I'm a Computer Systems Engineer who loves creating things from scratch or improving
                existing ones.
              </p>
            </Bio>
          </Description>
        </Overview>
      </AboutMeContainer>
    </Layout>
  );
};

export default AboutMe;
