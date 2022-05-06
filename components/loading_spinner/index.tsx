import { ThreeDots } from 'react-loader-spinner';
import theme from '../../utils/theme';

const LoadingSpinner = ({ width = '10vw', height = 'auto' }: any) => {
  return (
    <div>
      <ThreeDots height={width} width={height} color={theme.colors.primaryLight} />
    </div>
  );
};

export default LoadingSpinner;
