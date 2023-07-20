import {
  Stack,
  Chip,
  Typography,
  Avatar,
  TextField,
  useTheme,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Link,
} from '@mui/material';
import { ReachOutBubble } from 'components/reach-out-bubble';
import { useCallback, useMemo, useState } from 'react';

export const TechStack = () => {
  const theme = useTheme();
  const [filter, setFilter] = useState('');
  const [open, setOpen] = useState(false);

  const skills = useMemo(
    () => [
      // Databases
      {
        avatar: '/assets/images/skills/databases/open-search.png',
        name: 'Open Search',
      },
      {
        avatar: '/assets/images/skills/databases/firebase.svg',
        name: 'Firebase',
      },
      {
        avatar: '/assets/images/skills/databases/mongodb.svg',
        name: 'MongoDB',
      },
      {
        avatar: '/assets/images/skills/databases/mysql.svg',
        name: 'MySQL',
      },
      {
        avatar: '/assets/images/skills/databases/postgresql.svg',
        name: 'PostgreSQL',
      },
      {
        avatar: '/assets/images/skills/databases/redis.svg',
        name: 'Redis',
      },
      // Frameworks
      {
        avatar: '/assets/images/skills/frameworks/express.svg',
        name: 'ExpressJS',
      },
      {
        avatar: '/assets/images/skills/frameworks/flutter.svg',
        name: 'Flutter',
      },
      {
        avatar: '/assets/images/skills/frameworks/jest.svg',
        name: 'Jest',
      },
      {
        avatar: '/assets/images/skills/frameworks/nextjs.svg',
        name: 'NextJS',
      },
      {
        avatar: '/assets/images/skills/frameworks/nginx.svg',
        name: 'Nginx',
      },
      {
        avatar: '/assets/images/skills/frameworks/nodejs.svg',
        name: 'NodeJS',
      },
      {
        avatar: '/assets/images/skills/frameworks/react.svg',
        name: 'React',
      },
      {
        avatar: '/assets/images/skills/frameworks/redux.svg',
        name: 'Redux',
      },
      {
        avatar: '/assets/images/skills/frameworks/selenium.svg',
        name: 'Selenium',
      },
      {
        avatar: '/assets/images/skills/frameworks/threejs.svg',
        name: 'ThreeJS',
      },
      // Programming Languages
      {
        avatar: '/assets/images/skills/programming-languages/dart.svg',
        name: 'Dart',
      },
      {
        avatar: '/assets/images/skills/programming-languages/go.svg',
        name: 'Golang',
      },
      {
        avatar: '/assets/images/skills/programming-languages/java.svg',
        name: 'Java',
      },
      {
        avatar: '/assets/images/skills/programming-languages/javascript.svg',
        name: 'Javascript',
      },
      {
        avatar: '/assets/images/skills/programming-languages/php.svg',
        name: 'PHP',
      },
      {
        avatar: '/assets/images/skills/programming-languages/python.svg',
        name: 'Python',
      },
      {
        avatar: '/assets/images/skills/programming-languages/ruby.svg',
        name: 'Ruby',
      },
      {
        avatar: '/assets/images/skills/programming-languages/typescript.svg',
        name: 'Typescript',
      },
      // Tools
      {
        avatar: '/assets/images/skills/tools/aws.svg',
        name: 'Amazon Web Services',
      },
      {
        avatar: '/assets/images/skills/tools/babel.svg',
        name: 'Babel',
      },
      {
        avatar: '/assets/images/skills/tools/docker.svg',
        name: 'Docker',
      },
      {
        avatar: '/assets/images/skills/tools/git.svg',
        name: 'Git',
      },
      {
        avatar: '/assets/images/skills/tools/github.svg',
        name: 'GitHub',
      },
      {
        avatar: '/assets/images/skills/tools/gitlab.svg',
        name: 'GitLab',
      },
      {
        avatar: '/assets/images/skills/tools/google-cloud.svg',
        name: 'Google Cloud Platform',
      },
      {
        avatar: '/assets/images/skills/tools/jira.svg',
        name: 'Jira',
      },
      {
        avatar: '/assets/images/skills/tools/kubernetes.svg',
        name: 'Kubernetes',
      },
      {
        avatar: '/assets/images/skills/tools/npm.svg',
        name: 'NPM',
      },
      {
        avatar: '/assets/images/skills/tools/slack.svg',
        name: 'Slack',
      },
      {
        avatar: '/assets/images/skills/tools/travis.svg',
        name: 'Travis',
      },
      {
        avatar: '/assets/images/skills/tools/vscode.svg',
        name: 'VS Code',
      },
      {
        avatar: '/assets/images/skills/tools/webpack.svg',
        name: 'Web Pack',
      },
      {
        avatar: '/assets/images/skills/tools/xcode.svg',
        name: 'XCode',
      },
      {
        avatar: '/assets/images/skills/tools/yarn.svg',
        name: 'yarn',
      },
    ],
    [],
  );

  const filteredSkills = useMemo(
    () => (filter ? skills.filter(({ name }) => name.toLowerCase().includes(filter.toLowerCase())) : skills),
    [skills, filter],
  );

  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);

  return (
    <section id='tech-stack-section'>
      <ReachOutBubble onClick={handleOpen} />
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          <Typography variant='h4'>
            Get in <span style={{ color: theme.palette.primary.main }}>touch</span>
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>You can reach out to me through my social media:</DialogContentText>
          <Stack direction='row' p={2} spacing={2} flexWrap='wrap' rowGap={2} justifyContent='center'>
            <Link href='https://www.linkedin.com/in/eibautistat/' target='_blank' rel='noopener noreferrer'>
              <Avatar src='assets/images/social-media/linkedin-logo.png' alt='LinkedIn' />
            </Link>
            <Link href='https://www.linkedin.com/in/eibautistat/' target='_blank' rel='noopener noreferrer'>
              <Avatar src='assets/images/social-media/github-logo.png' alt='Github' />
            </Link>
            <Link href='https://www.instagram.com/ethanisaac96/' target='_blank' rel='noopener noreferrer'>
              <Avatar src='assets/images/social-media/instagram-logo.webp' alt='Instagram' />
            </Link>
            <Link href='https://discord.gg/zZZSyhetuU' target='_blank' rel='noopener noreferrer'>
              <Avatar src='assets/images/social-media/discord-logo.png' alt='Discord' />
            </Link>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
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
          My <span style={{ color: theme.palette.primary.main }}> Tech Stack</span>
        </Typography>
        <TextField
          color='secondary'
          label='Search'
          value={filter}
          helperText='Search for specific skills'
          placeholder='Type here'
          onChange={(e) => setFilter(e.target.value)}
        />
        <Stack flexWrap='wrap' direction='row' spacing={2} justifyContent='center' rowGap={2} maxWidth='800px'>
          {filteredSkills.map(({ name, avatar }) => (
            <Chip
              variant='filled'
              avatar={
                <Avatar alt={name} src={avatar}>
                  {name[0]}
                </Avatar>
              }
              label={name}
            />
          ))}
        </Stack>
        <Button size='large' variant='contained' color='secondary' onClick={handleOpen}>
          Get in touch
        </Button>
      </Stack>
    </section>
  );
};
