import { Button, Stack, Typography, useTheme } from '@mui/material';
import Image from 'next/image';
import { useMemo, useCallback } from 'react';
import { SiRiotgames } from 'react-icons/si';
import { Experience, IExperienceProps } from './experience';

export const MyExperience = () => {
  const theme = useTheme();

  const handleSeeMore = useCallback(() => {
    document.getElementById('tech-stack-section')?.scrollIntoView({
      behavior: 'smooth',
    });
  }, []);

  const experiences: Array<IExperienceProps> = useMemo(
    () => [
      {
        company: 'Siingly',
        duration: 'Jan 2023 - Present',
        role: 'Founder & Chief Technology Officer',
        link: 'https://siingly.com',
        logo: <Image src='/assets/images/experience/siingly-logo.svg' alt='Buscavi' width='150' height='50' />,
        description: (
          <>
            Siingly is a revolutionary Dating App that focuses on Quality Over Quantity.
            <br />
            <br />
            I met Daniel (my partner and CEO at Siingly) in 2019 when I started working at Paxico Technologies. We
            became partners and started working on this project with little to no money or investment.
            <br />
            <br />
            As the technical leader I have successfully launched the mobile app, website, internal dashboard platform,
            and our backend architecture using the aws and gcp platforms. Also, I implemented a CI/CD pipeline that
            allows us to distribute new versions of our applications in minutes.
          </>
        ),
      },
      {
        company: 'Riot Games',
        duration: 'Oct 2022 - Present',
        role: 'Senior Software Engineer',
        link: 'https://riotgames.com',
        logo: <SiRiotgames size='50px' />,
        description: (
          <>
            Riot Games is a videogame company, responsible for publishing some of the most famous games such as League
            of Legends, Valorant, Teamfight Tactics, Wild Rift and some others.
            <br />
            <br />I work with the Global Player Support team and I am responsible for creating new features and bug
            fixing of our internal platforms. I have proposed multiple tools and refactors to improve the backend
            services performance along with some Typescript and React updates for our frontend platforms.
          </>
        ),
      },
      {
        company: 'The Institutes',
        duration: 'Aug 2022 - Oct 2022',
        role: 'Lead Software Engineer',
        link: 'https://web.theinstitutes.org/',
        logo: <Image src='/assets/images/experience/the-institutes-logo.png' alt='Buscavi' width='50' height='50' />,
        description: (
          <>
            The Institutes is a company that provides courses and certifications for agents working on risk management
            and insurances.
            <br />
            <br />
            As part of the technical leadership I was responsible for the architectural design, prioritization and
            tracking of multiple features for the platform. I provided technical knowledge of the app for junior
            developers and was responsible for the migration of the components library to React + Typescript.
          </>
        ),
      },
      {
        company: 'Loadsy',
        duration: 'Oct 2021 - Aug 2022',
        role: 'Chief Technology Officer',
        link: 'https://loadsy.io',
        logo: <Image src='/assets/images/experience/loadsy-logo.svg' alt='Buscavi' width='100' height='50' />,
        description: (
          <>
            Loadsy is a Load Testing Tool for engineering folks.
            <br />
            <br />
            Along with the Paxico Founders, we built this project from scratch to provide load testing capabilities to
            the engineering teams CI/CD pipeline.
            <br />
            <br />I took full responsibility for the architectural design and development of this project. Leading a
            team of 5 engineers we brought this project to life after 6 months of development. All the architecture was
            deployed in AWS using Kubernetes + ArgoCD for the backend Golang microservices and the frontent was deployed
            as a static SPA in AWS S3 with CloudFront as our CDN.
          </>
        ),
      },
      {
        company: 'Paxico',
        duration: 'Jul 2019 - Aug 2022',
        role: 'Partner & VP of Engineering',
        link: 'https://paxicotech.com',
        logo: <Image src='/assets/images/experience/paxico-logo.png' alt='Buscavi' width='150' height='50' />,
        description: (
          <>
            Paxico is a Staff Augmentation company, but also cradle of entrepreneurship. So along with providing
            engineering force to our clients, we developed internal projects (such as Loadsy and Siingly).
            <br />
            <br />I joined as an intern back in 2019, quickly grew my knowledge to become a Software Engineer, then team
            leader and finally, due to my commitment, hard work and excellent skills I became partner of the company and
            led the Engineering department as Vice President of Engineering.
          </>
        ),
      },
      {
        company: 'Tecnológico de Monterrey',
        duration: 'Jul 2019 - Aug 2022',
        role: 'Programming Teacher',
        link: 'https://tec.mx/es/estado-de-mexico',
        logo: <Image src='/assets/images/experience/itesm-logo.svg' alt='Buscavi' width='50' height='50' />,
        description: (
          <>
            The Tecnológico de Monterrey is one of the most prestigious private universities in Mexico, and, my Alma
            Máter.
            <br />
            <br />
            My skills and desire to help others sent me in the direction of teaching. I educated students from 15 to 18
            years old to learn the basics or programming using a small Python library called Turtle. I guided them
            through the semester to create, from scratch, the conceptual design, materials, and developent of their own
            video game.
          </>
        ),
      },
      {
        company: 'Buscavi',
        duration: 'Oct 2018 - Dec 2021',
        role: 'Founder & Chief Technology Officer',
        link: 'https://buscavi.com',
        logo: <Image src='/assets/images/experience/buscavi-logo.png' alt='Buscavi' width='60' height='50' />,
        description: (
          <>
            Buscavi is a real estate company with a technological foundation that seeks to advise people to make the
            best decision in the purchase of their home. We offer a comprehensive service from the analysis of the
            financial situation, choice of credit, financial plans, analysis and choice of housing, as well as advice on
            legal processes. In addition to the main business, Buscavi is the cradle of entrepreneurship, which is why
            we create and develop technological projects in different areas.
            <br />
            <br />I kickstarted my career as developer and leader with a small familiar project. My family has been in
            the industry of real estate for years and with my technological knowledge we built this company from
            scratch.
            <br />
            <br />I designed and developer multiple internal tools to allow our real estate agents to provide a better
            quality of service to our clients. Those tools were designed to help clients make a better choice, depending
            of their intentions, either for buying a home or investing.
          </>
        ),
      },
      {
        company: 'Maestro Interactive',
        duration: 'Dec 2019 - Jun 2020',
        role: 'Lead Software Engineer',
        link: 'https://maestro.io',
        logo: <Image src='/assets/images/experience/maestro-logo.svg' alt='Buscavi' width='140' height='50' />,
        description: (
          <>
            Maestro is a Streaming Platform for individuals or organizations looking to create and broadcast content to
            millions of users while keeping the earnings for themselves, and directing the traffic to their own site
            instead of a streaming platform.
            <br />
            <br />I joined as a Software Engineer and quickly became a leader, designing and building with a small team
            of 3 people multiple of the features that Maestro offers nowadays, but also, some of the internal mechanisms
            to handle potential service outtages.
          </>
        ),
      },
    ],
    [],
  );

  return (
    <section id='my-experience-section'>
      <Stack
        alignItems='center'
        justifyContent='center'
        spacing={4}
        p={4}
        width='100%'
        minHeight='100dvh'
        boxSizing='border-box'
        textAlign='center'
      >
        <Typography variant='h3'>
          My <span style={{ color: theme.palette.primary.main }}> Experience</span>
        </Typography>
        <Stack direction='row' flexWrap='wrap' justifyContent='center' spacing={2} rowGap={2}>
          {experiences.map((props) => (
            <Experience key={props.company} {...props} />
          ))}
        </Stack>
        <Button size='large' variant='contained' color='secondary' onClick={handleSeeMore}>
          See more
        </Button>
      </Stack>
    </section>
  );
};
