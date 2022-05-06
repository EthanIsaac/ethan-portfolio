import Head from 'next/head';
import { useState } from 'react';
import Background from '../components/background';
import Scroller from '../components/scroller';

const INITIAL_CAMERA_POSITION: [number, number, number] = [0, 0, 5];

export default function Home() {
  const [cameraPosition, setCameraPosition] = useState<[number, number, number]>(INITIAL_CAMERA_POSITION);

  const handleSectionChange = (index: number) => {
    switch (index) {
      case 0:
        setCameraPosition(INITIAL_CAMERA_POSITION);
        break;
      case 1:
        setCameraPosition([2, 0, 1]);
        break;
      case 2:
        setCameraPosition([1, 2, 2]);
        break;
      case 3:
        setCameraPosition([2, 1, 2]);
        break;
      default:
        setCameraPosition(INITIAL_CAMERA_POSITION);
    }
  };

  return (
    <>
      <Head>
        <title>{'Ethan Portfolio'}</title>
      </Head>
      <Background position={cameraPosition} />
      <Scroller id="my-scroller" onSectionChange={handleSectionChange}>
        <div> HELLO </div>
        <div> WORLD </div>
        <div> WORLD </div>
        <div> WORLD </div>
        <div> WORLD </div>
        <div> WORLD </div>
      </Scroller>
    </>
  );
}
