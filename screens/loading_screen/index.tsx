import React from 'react';
import LoadingSpinner from '../../components/loading_spinner';
import { LoadingScreenContainer } from './styled';

const LoadingScreen = ({ visible }) => {
  return (
    <LoadingScreenContainer visible={visible}>
      <h2>Still building... It will be amazing when it's done!</h2>
      <img style={{ paddingBottom: '5vh' }} src={'assets/images/coder.png'} />
      <LoadingSpinner />
    </LoadingScreenContainer>
  );
};

export default LoadingScreen;
