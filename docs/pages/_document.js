import { Head, Html, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width" />

        {/* PNG favicons as fallback for browsers that don't support SVG */}
        <link href="/favicon-32x32.png" rel="icon" type="image/png" sizes="32x32" />
        <link href="/favicon-16x16.png" rel="icon" type="image/png" sizes="16x16" />

        {/* SVG favicons for theme switching (modern browsers) */}
        <link href="/logo-dark.svg" rel="icon" type="image/svg+xml" className="favicon-dark" />
        <link href="/logo.svg" rel="icon" type="image/svg+xml" className ="favicon-light" />

        {/* Apple touch icon */}
        <link href="/apple-touch-icon.png" rel="apple-touch-icon" sizes="180x180" />

        {/* Web manifest */}
        <link href="/webmanifest" rel="manifest" />

        {/* Android Chrome icon */}
        <link href="/android-chrome-192x192.png" rel="mask-icon" />

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

        {/* Favicon controller for theme switching */}
        <script src="/favicon-controller.js" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
