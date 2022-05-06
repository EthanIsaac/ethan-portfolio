import Head from 'next/head';
import Footer from '../components/footer';
import theme from '../utils/theme';

export default function Home() {
  return (
    <div>
      <Head>
        <title>{'Ethan Portfolio'}</title>
      </Head>
      <div>Content</div>
    </div>
  );
}
