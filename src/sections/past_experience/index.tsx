import Layout from 'components/layout';
import Timeline from 'components/timeline';
import { useMemo } from 'react';
import Buscavi from './buscavi';
import { PastExperienceContainer } from './styles';

const PastExperience = () => {
  const events = useMemo(
    () => [
      {
        title: 'Buscavi',
        start: new Date(),
        end: new Date(),
        src: 'assets/images/timeline/buscavi.png',
        content: Buscavi,
      },
      {
        title: 'Siingly',
        start: new Date(),
        end: new Date(),
        src: 'assets/images/timeline/siingly.png',
        content: Buscavi,
      },
      {
        title: 'Buscavi',
        start: new Date(),
        end: new Date(),
        src: 'assets/images/timeline/buscavi.png',
        content: Buscavi,
      },
      {
        title: 'Siingly',
        start: new Date(),
        end: new Date(),
        src: 'assets/images/timeline/siingly.png',
        content: Buscavi,
      },
      {
        title: 'Buscavi',
        start: new Date(),
        end: new Date(),
        src: 'assets/images/timeline/buscavi.png',
        content: Buscavi,
      },
      {
        title: 'Siingly',
        start: new Date(),
        end: new Date(),
        src: 'assets/images/timeline/siingly.png',
        content: Buscavi,
      },
      {
        title: 'Buscavi',
        start: new Date(),
        end: new Date(),
        src: 'assets/images/timeline/buscavi.png',
        content: Buscavi,
      },
      {
        title: 'Siingly',
        start: new Date(),
        end: new Date(),
        src: 'assets/images/timeline/siingly.png',
        content: Buscavi,
      },
    ],
    [],
  );

  return (
    <Layout>
      <PastExperienceContainer>
        <Timeline events={events} />
      </PastExperienceContainer>
    </Layout>
  );
};

export default PastExperience;
