import React from 'react';
import Background from '../../components/background';
import LoadingSpinner from '../../components/loading_spinner';
import { LoadingScreenContainer } from './styled';

const LoadingScreen = ({ visible }) => {
  return (
    <LoadingScreenContainer visible={visible}>
      <Background position={[0, 0, 0]} />
      <h1>Still building</h1>
      <LoadingSpinner width="auto" height="auto" />
      <h2>It will be amazing when it's done!</h2>
      <img style={{ paddingBottom: '5vh' }} src={'assets/images/coder.png'} />
    </LoadingScreenContainer>
  );
};

export default LoadingScreen;
