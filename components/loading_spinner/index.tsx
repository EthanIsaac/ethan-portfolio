import { InfinitySpin, ThreeDots } from 'react-loader-spinner';
import theme from '../../utils/theme';

const LoadingSpinner = () => {
  return (
    <div>
      <ThreeDots width="10vw" color={theme.colors.primaryLight} />
    </div>
  );
};

export default LoadingSpinner;
