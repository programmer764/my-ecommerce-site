// pages/_document.js
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {/* Можно добавить и другие метатеги */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
