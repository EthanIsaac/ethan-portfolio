import {
  Stack,
  Typography,
  Divider,
  useTheme,
  Button,
  Link,
  Dialog,
  DialogTitle,
  DialogContentText,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useCallback, useState } from 'react';

export interface IExperienceProps {
  company: string;
  duration: string;
  role: JSX.Element | string;
  description: JSX.Element | string;
  logo: JSX.Element;
  link: string;
}

export const Experience = ({ company, duration, description, logo, link, role }: IExperienceProps) => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const handleClose = useCallback(() => setOpen(false), []);

  const handleOpen = useCallback(() => setOpen(true), []);

  return (
    <>
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>
          <Stack spacing={2}>
            <Stack alignItems='center'>{logo}</Stack>
            <Stack>
              <Typography variant='h4'>
                {company} - <span style={{ color: theme.palette.primary.main }}>{role}</span>
              </Typography>
              <Typography variant='subtitle1' color={theme.palette.primary.main}>
                {duration}
              </Typography>
            </Stack>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>{description}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
      <Stack p={2} maxWidth='500px' minWidth='250px' flex={1} spacing={2} alignItems='center'>
        <Link
          href={link}
          target='_blank'
          referrerPolicy='no-referrer'
          sx={(theme) => ({ color: theme.palette.primary.contrastText })}
        >
          {logo}
        </Link>
        <Stack>
          <Typography variant='h4'>{company}</Typography>
          <Typography variant='subtitle1' color={theme.palette.primary.light}>
            {duration}
          </Typography>
        </Stack>
        <Divider sx={{ width: '100%' }} color='white' />
        <Typography>{role}</Typography>
        <Button color='secondary' variant='outlined' onClick={handleOpen}>
          Learn more
        </Button>
      </Stack>
    </>
  );
};
