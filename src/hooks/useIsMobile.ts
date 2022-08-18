import { useMediaQuery } from 'react-responsive';
import { MOBILE_MAX_HEIGHT_PX, MOBILE_MAX_WIDTH_PX } from '../utils/constants/responsiveness';

const useIsMobile = () => {
  return useMediaQuery({
    query: `(max-width: ${MOBILE_MAX_WIDTH_PX}px) or (max-height: ${MOBILE_MAX_HEIGHT_PX}px)`,
  });
};

export default useIsMobile;
