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
import ReactTooltip from 'react-tooltip';

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
                My name's Ethan. I'm a Computer Systems Engineer with team and project management skills. I focus on
                problem solving using modern tools to generate high-impact, innovative ideas.
              </p>
              <p>
                My areas of greatest interest are technology project management, artificial intelligence, computer
                security and cloud computing, so my solution proposals involve different perspectives generating
                innovation projects.
              </p>
              <p>
                My free time is dedicated to playing video games, reading books, practicing dance and traveling inside
                and outside of Mexico. I speak Spanish, English and I'm currently studying French.
              </p>
              <p>Check out some of the projects I've worked on here:</p>
            </Bio>
            <p data-tip='' data-for='test'></p>
            <PreviousProjects>
              <ReactTooltip id='deprecated' type='warning' effect='solid' place='top' multiline>
                <span>
                  This project has been deprecated
                  <br />
                  and is no longer available
                </span>
              </ReactTooltip>
              <div>
                <a href='http://siingly.com/' target='_blank' rel='noopener noreferrer'>
                  <img src='/assets/images/previous-projects/siingly-logo.svg' alt='Siingly'></img>
                </a>
              </div>
              <div>
                <a href='http://buscavi.com/' target='_blank' rel='noopener noreferrer'>
                  <img src='/assets/images/previous-projects/buscavi-logo.png' alt='Buscavi'></img>
                </a>
              </div>
              <div>
                <a href='https://www.maestro.io/' target='_blank' rel='noopener noreferrer'>
                  <img src='/assets/images/previous-projects/maestro-logo.svg' alt='Maestro.io'></img>
                </a>
              </div>
              <div>
                <a data-tip data-for='deprecated' href='http://loadsy.io/' target='_blank' rel='noopener noreferrer'>
                  <img src='/assets/images/previous-projects/loadsy-logo.svg' alt='Loadsy'></img>
                </a>
              </div>
              <div>
                <a
                  data-tip
                  data-for='deprecated'
                  href='http://paxicotech.com/'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <img src='/assets/images/previous-projects/paxico-logo.png' alt='Paxico'></img>
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
