import Head from 'next/head';
import { useMemo, useState } from 'react';
import Background from '../components/background';
import Scroller from '../components/scroller';
import AboutMe from '../sections/about_me';
import Hobbies from '../sections/hobbies';
import PastExperience from '../sections/past_experience';
import Skills from '../sections/skills';

const INITIAL_CAMERA_POSITION: [number, number, number] = [0, 0, 2];

interface Section {
  title: string;
  cameraPosition: [number, number, number];
  Component: () => JSX.Element;
}

export default function Home() {
  const [currentSection, setCurrentSection] = useState(0);

  const sections: Array<Section> = useMemo(
    () => [
      {
        title: 'About me',
        Component: AboutMe,
        cameraPosition: INITIAL_CAMERA_POSITION,
      },
      {
        title: 'Skills',
        Component: Skills,
        cameraPosition: [1, 0, 0],
      },
      {
        title: 'Past experience',
        Component: PastExperience,
        cameraPosition: [1, 2, 2],
      },
      {
        title: 'Hobbies',
        Component: Hobbies,
        cameraPosition: [2, 1, 2],
      },
    ],
    [],
  );

  const handleSectionChange = (index: number) => {
    setCurrentSection(index);
  };

  return (
    <>
      <Head>
        <title>{'Ethan Resume'}</title>
      </Head>
      <Background position={sections[currentSection].cameraPosition} />
      <Scroller id="my-scroller" onSectionChange={handleSectionChange} sections={sections} />
    </>
  );
}
