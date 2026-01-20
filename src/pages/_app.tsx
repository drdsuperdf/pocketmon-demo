// pages/_app.tsx
import { appWithTranslation } from 'next-i18next';
import type { AppProps } from 'next/app';
import './globals.css'; // ✅ 修正路径

import Head from 'next/head';
import { useEffect } from 'react';

function MyApp({ Component, pageProps }: AppProps) {
   useEffect(() => {
    if (typeof window !== 'undefined') {
      // 只在开发环境中启用 vConsole
      // if (process.env.NODE_ENV === 'development') {
      //   import('vconsole').then(({ default: VConsole }) => {
      //     new VConsole();
      //     console.log('vConsole is enabled');
      //   });
      // }
    }
  }, []);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {/* <meta name="viewport" content="width=device-width, initial-scale=1" /> */}
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default appWithTranslation(MyApp);
