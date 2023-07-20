import { Link, Stack, Tooltip, Typography, useTheme, Button } from '@mui/material';
import { useCallback } from 'react';
import CodeIcon from '@mui/icons-material/Code';
import Diversity1Icon from '@mui/icons-material/Diversity1';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import NightlifeIcon from '@mui/icons-material/Nightlife';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';

export const WhoIsEthan = () => {
  const theme = useTheme();

  const handleSeeMore = useCallback(() => {
    document.getElementById('my-experience-section')?.scrollIntoView({
      behavior: 'smooth',
    });
  }, []);

  return (
    <section id='who-is-ethan-section'>
      <Stack
        alignItems='center'
        justifyContent='center'
        spacing={2}
        p={4}
        width='100%'
        minHeight='100dvh'
        boxSizing='border-box'
        textAlign='center'
      >
        <Typography variant='h3'>
          Who is <span style={{ color: theme.palette.primary.main }}> Ethan</span>?
        </Typography>
        <Stack
          borderRadius='10px'
          border='1px solid white'
          borderBottom='none'
          borderTop='none'
          p={2}
          maxWidth='500px'
          spacing={2}
          alignItems='center'
        >
          <Typography>
            I am a driven Senior Software Engineer with a remarkable career progression, excelling in software
            architecture, development, leadership, and team management. From Software Developer Intern to Vice President
            of Engineering and Chief Technology Officer, my thirst for knowledge and proactive approach have propelled
            my success.
          </Typography>
          <Typography>
            I built the successful dating app{' '}
            <Link color='#F28500' href='https://siingly.com' target='_blank'>
              Siingly
            </Link>{' '}
            from concept to deployment on AWS, showcasing my innovation and dedication. Continuously seeking
            opportunities and fostering a strong network, I stay at the forefront of the ever-evolving tech industry,
            embodying excellence and growth.
          </Typography>
          <Stack direction='row' spacing={2}>
            <Tooltip title='Coder'>
              <CodeIcon fontSize='large' />
            </Tooltip>
            <svg width={0} height={0}>
              <linearGradient id='lgbtGradient'>
                <stop offset='0%' stopColor='#FF0018' />
                <stop offset='33.3%' stopColor='#FFFF41' />
                <stop offset='66.6%' stopColor='#008018' />
                <stop offset='100%' stopColor='#8B00FF' />
              </linearGradient>
            </svg>
            <Tooltip title='LGBTQ+'>
              <Diversity1Icon fontSize='large' sx={{ fill: 'url(#lgbtGradient)' }} />
            </Tooltip>
            <Tooltip title='Volunteer'>
              <VolunteerActivismIcon fontSize='large' />
            </Tooltip>
            <Tooltip title='Socialite'>
              <NightlifeIcon fontSize='large' />
            </Tooltip>
            <Tooltip title='Traveller'>
              <FlightTakeoffIcon fontSize='large' />
            </Tooltip>
          </Stack>
        </Stack>
        <Button size='large' variant='contained' color='secondary' onClick={handleSeeMore}>
          See more
        </Button>
      </Stack>
    </section>
  );
};
