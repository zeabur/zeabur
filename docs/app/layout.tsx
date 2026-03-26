import { fontVariableClasses } from '../lib/fonts'
// Import fonts to prevent tree-shaking
import '../lib/fonts'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'Zeabur Documentation',
    template: '%s - Zeabur',
  },
  description: 'Zeabur: Deploy your service with one click.',
  metadataBase: new URL('https://zeabur.com/docs'),
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180' },
    ],
  },
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en-US" className={fontVariableClasses} suppressHydrationWarning>
      <head>
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
        <script src="/docs/favicon-controller.js" />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
