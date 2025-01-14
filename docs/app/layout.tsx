import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Banner, Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import './styles.css'
import 'nextra-theme-docs/style.css'
import { Metadata, Viewport } from 'next'
import LogoBlack from '../public/logo_b.svg'
import LogoWhite from '../public/logo_w.svg'

export const metadata: Metadata = {
  title: {
    default: 'Docs - Zeabur',
    template: '%s - Zeabur',
  },
  description: "Zeabur: Deploy your service with one click.",  // TODO: https://the-guild.dev/blog/nextra-4#dynamic-head-tags
  openGraph: {
    url: './',
    images: '', // wip
  }, // TODO: useTheme()?
  appleWebApp: {
    capable: true,
    title: 'Zeabur',
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/apple-touch-icon.png',
    other: [
      {
        type: 'image/png',
        sizes: '192x192',
        url: "/android-chrome-192x192.png",
      },
      {
        type: 'image/png',
        sizes: '32x32',
        url: "/favicon-32x32.png",
      },
      {
        type: 'image/png',
        sizes: '16x16',
        url: "/favicon-16x16.png",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: 'zeabur.com',
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1.0,
}

const navbar = (
  <Navbar
    projectLink="https://github.com/zeabur"
    chatLink="https://zeabur.com/dc"
    logo={<>
      <img
        src={LogoBlack.src}
        style={{ height: 20, objectFit: 'contain' }}
        alt="zeabur"
        className="black-logo"
      />
      <img
        src={LogoWhite.src}
        style={{ height: 20, objectFit: 'contain' }}
        alt="zeabur"
        className="white-logo"
      />
    </>}
  />
);

const footer = (
  <Footer className="flex-col items-center md:items-start">
    {new Date().getFullYear()} ©
    <a href="https://zeabur.com" target="_blank">
      Zeabur Pte. Ltd.
    </a>
  </Footer>
)

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <Head
          color={{
            hue: { dark: 278, light: 265 },
          }}
        >
          <script
            async
            src="https://www.googletagmanager.com/gtag/js?id=G-F0FE9EJZ4E"
          ></script>
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
      </head>
      <body>
        <Layout
          pageMap={await getPageMap()}
          docsRepositoryBase='https://github.com/zeabur/zeabur/tree/main/docs'
          editLink="Edit this page on GitHub"
          navbar={navbar}
          footer={footer}
          sidebar={{
            defaultMenuCollapseLevel: 1,
          }}
          i18n={[
            { locale: 'en-US', name: 'English' },
            { locale: 'zh-TW', name: '繁體中文' },
            { locale: 'zh-CN', name: '简体中文' },
            { locale: 'ja-JP', name: '日本語' },
            { locale: 'es-ES', name: 'Español' },
          ]}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}
