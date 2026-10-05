import { useMediaQuery } from 'react-responsive';
import { MOBILE_CSS_QUERY } from '../utils/constants/responsiveness';

const useIsMobile = () => {
  return useMediaQuery({
    query: MOBILE_CSS_QUERY,
  });
};

export default useIsMobile;
