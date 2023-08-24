import { Head, Html, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/icon?<generated>" />
        <link rel="shortcut icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <meta name="og:title" content="Zeabur" />
        <meta name="og:image" content="/default-og.png" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="/default-og.png" />
        <meta property="twitter:site:domain" content="zeabur.com" />
        <meta property="twitter:url" content="https://zeabur.com" />
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-F0FE9EJZ4E"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

gtag('config', 'G-F0FE9EJZ4E');
`,
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
