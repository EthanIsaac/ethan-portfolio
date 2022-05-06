import Head from 'next/head';
import Scroller from '../components/scroller';

export default function Home() {
  return (
    <>
      <Head>
        <title>{'Ethan Portfolio'}</title>
      </Head>
      <Scroller id="my-scroller">
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
