import Layout from '../components/layout';
import '../styles/global_style.css';
export default function App({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
