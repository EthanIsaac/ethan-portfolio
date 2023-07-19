'use client';
import { Box, useTheme } from '@mui/material';
import Background from 'components/background';
import { Intro } from 'landing-sections/intro';

const Landing = () => {
  return (
    <Box minWidth='100%' minHeight='100%' position='relative'>
      <Background position={[1, 0, 0]} />
      <Intro />
    </Box>
  );
};

export default Landing;
