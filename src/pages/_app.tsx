import type { AppType } from 'next/dist/shared/lib/utils';
import Head from 'next/head';
import Logo from '../components/Logo';
import '../styles/globals.css';

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>Notes of Salem</title>
        <link rel="icon" href="/icon.png" />
      </Head>
      <div className="body-container">
        <Logo />
        <Component {...pageProps} />
      </div>
    </>
  );
};

export default MyApp;
