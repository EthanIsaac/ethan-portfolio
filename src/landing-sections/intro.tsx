import { Stack, Typography, Box, useTheme } from '@mui/material';
import Image from 'next/image';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';

export const Intro = () => {
  const theme = useTheme();
  return (
    <Stack
      alignItems='center'
      justifyContent='center'
      spacing={2}
      p={4}
      width='100%'
      minHeight='100dvh'
      boxSizing='border-box'
    >
      <Typography variant='h3'>
        Ethan <span style={{ color: theme.palette.primary.main }}> Trevizo</span>
      </Typography>
      <Box>
        <Image
          alt='Selfie'
          src='/assets/images/ethan-selfie.jpg'
          height='300'
          width='220'
          style={{
            borderRadius: '50% 50% 0 0',
            border: '5px double white',
          }}
        />
      </Box>
      <Typography variant='h4'>
        Passionate <span style={{ color: theme.palette.primary.main }}> leader</span> and{' '}
        <span style={{ color: theme.palette.primary.main }}> entrepreneur</span>
      </Typography>
      <Stack spacing={1} p={2} border='1px solid white' borderRadius='10px' maxWidth='300px' alignItems='flex-end'>
        <Stack direction='row' spacing={1}>
          <FormatQuoteIcon />
          <Typography variant='h5'>
            Innovation is a process that requires effort and dedication. Talent without commitment does not generate
            progress.
          </Typography>
        </Stack>
        <Typography variant='caption'>— Ethan Trevizo, 2018</Typography>
      </Stack>
    </Stack>
  );
};
