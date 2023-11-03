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

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://zeabur.com" />
        <meta name="twitter:site" content="@zeaburapp" />
        <meta
          name="twitter:title"
          content="Zeabur - Deploy Painlessly, Scale Infinitely"
        />
        <meta
          name="twitter:description"
          content="Zeabur is a platform helping deploy services painlessly and scale infinitely."
        />
        <meta
          name="twitter:image"
          content="https://zeabur.com/default-og.png"
        />

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
