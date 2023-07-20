'use client';
import { Box } from '@mui/material';
import Background from 'components/background';
import { Intro } from 'landing-sections/intro';
import { WhoIsEthan } from 'landing-sections/whoIsEthan';
import { MyExperience } from 'landing-sections/my-experience';
import { TechStack } from 'landing-sections/tech-stack';

const Landing = () => {
  return (
    <Box minWidth='100%' minHeight='100%' position='relative'>
      <Background position={[1, 0, 0]} />
      <Intro />
      <WhoIsEthan />
      <MyExperience />
      <TechStack />
    </Box>
  );
};

export default Landing;
