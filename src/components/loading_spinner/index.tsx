import { Box, useTheme } from '@mui/material';
import { ThreeDots } from 'react-loader-spinner';

const LoadingSpinner = ({ width = '10vw', height = 'auto' }: any) => {
  const theme = useTheme();
  return (
    <Box>
      <ThreeDots height={width} width={height} color={theme.palette.primary.light} />
    </Box>
  );
};

export default LoadingSpinner;
