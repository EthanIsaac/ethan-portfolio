import Head from 'next/head';
import { useState } from 'react';
import Background from '../components/background';
import NavBar from '../components/nav_bar';
import Scroller from '../components/scroller';

const INITIAL_CAMERA_POSITION: [number, number, number] = [0, 0, 2];

export default function Home() {
  const [cameraPosition, setCameraPosition] = useState<[number, number, number]>(INITIAL_CAMERA_POSITION);
  const [currentSection, setCurrentSection] = useState(0);

  const handleSectionChange = (index: number) => {
    setCurrentSection(index);
    switch (index) {
      case 0:
        setCameraPosition(INITIAL_CAMERA_POSITION);
        break;
      case 1:
        setCameraPosition([1, 0, 0]);
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
      <NavBar currentSection={currentSection} />
      <Background position={cameraPosition} />
      <Scroller
        id="my-scroller"
        onSectionChange={handleSectionChange}
        sections={[
          {
            title: 'My first section',
            component: <div>Hello world!</div>,
          },
          {
            title: 'My second section',
            component: <div>Hello world!</div>,
          },
          {
            title: 'My third section',
            component: <div>Hello world!</div>,
          },
          {
            title: 'My fourth section',
            component: <div>Hello world!</div>,
          },
        ]}
      />
    </>
  );
}
