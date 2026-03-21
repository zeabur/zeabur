import { Head, Html, Main, NextScript } from 'next/document'
import { fontVariableClasses } from '../lib/fonts'

export default function Document() {
  return (
    <Html className={fontVariableClasses}>
      <Head>
        <meta charSet="utf-8" />

        {/* Fonts loaded via next/font in lib/fonts.ts — no CDN needed */}

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
