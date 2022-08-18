import Layout from 'components/layout';
import {
  AboutMeContainer,
  AvatarPicture,
  Description,
  Title,
  Overview,
  Subtitle,
  Bio,
  Quote,
  PreviousProjects,
} from './styles';

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
              <p>
                I've grown my career working in Startups since the beginning, some of them were my own entrepreneurship,
                but you know... sometimes it just doesn't work out. But that never stopped me from keep trying, you can
                check some of my previous projects here:
              </p>
            </Bio>
            <PreviousProjects>
              <div>
                <a href='http://siingly.com/' target='_blank' rel='noopener noreferrer'>
                  <img src='/assets/images/previous-projects/siingly-logo.svg'></img>
                </a>
              </div>
              <div>
                <a href='http://buscavi.com/' target='_blank' rel='noopener noreferrer'>
                  <img src='/assets/images/previous-projects/buscavi-logo.png'></img>
                </a>
              </div>
              <div>
                <a href='http://siingly.com/' target='_blank' rel='noopener noreferrer'>
                  <img src='/assets/images/previous-projects/siingly-logo.svg'></img>
                </a>
              </div>
              <div>
                <a href='http://buscavi.com/' target='_blank' rel='noopener noreferrer'>
                  <img src='/assets/images/previous-projects/buscavi-logo.png'></img>
                </a>
              </div>
            </PreviousProjects>
          </Description>
        </Overview>
      </AboutMeContainer>
    </Layout>
  );
};

export default AboutMe;
