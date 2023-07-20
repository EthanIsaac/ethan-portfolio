import { Stack, Button } from '@mui/material';

interface IReachOutBubbleProps {
  onClick: () => void;
}

export const ReachOutBubble = ({ onClick }: IReachOutBubbleProps) => {
  return (
    <Stack
      position='fixed'
      bottom='20px'
      right='20px'
      sx={{
        animation: 'bounceInRight',
        animationDuration: '1s',
      }}
    >
      <Button
        onClick={onClick}
        variant='contained'
        color='secondary'
        sx={{
          width: '70px',
          height: '70px',
          borderRadius: '50%',
        }}
      >
        Reach out!
      </Button>
    </Stack>
  );
};
