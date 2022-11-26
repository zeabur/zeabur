export default {
  github: 'https://github.com/zeabur',
  docsRepositoryBase: 'https://github.com/zeabur/docs',
  titleSuffix: ' – Zeabur',
  i18n: [
    { locale: 'en-US', text: 'English' },
    { locale: 'zh-TW', text: '繁體中文' },
    { locale: 'zh-CN', text: '简体中文' },
  ],
  logo: (
    <>
      <img src="/favicon.ico" style={{ height: 36, objectFit: 'contain' }} />
      <span style={{fontWeight:'bolder',fontSize:'large',marginLeft:'10px'}}>
        Zeabur
      </span>
    </>
  ),
  head: (
    <>
      <meta name="msapplication-TileColor" content="#ffffff" />
      <meta name="theme-color" content="#ffffff" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Language" content="en" />
      <meta name="description" content="Zeabur Docs" />
      <meta name="og:description" content="Zeabur: Deploy your service with one click." />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content="https://docs.zeabur.com/og.png" />
      <meta name="twitter:site:domain" content="docs.zeabur.com" />
      <meta name="twitter:url" content="https://docs.zeabur.com" />
      <meta name="og:title" content="Zeabur: Deploy your service with one click." />
      <meta name="og:image" content="https://docs.zeabur.com/og.png" />
      <meta name="apple-mobile-web-app-title" content="Zeabur" />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="192x192"
        href="/android-chrome-192x192.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
    </>
  ),
  search: true,
  darkMode: true,
  prevLinks: true,
  nextLinks: true,
  footer: true,
  footerEditLink: false,
  footerText: <>{new Date().getFullYear()} © Zeabur.</>,
}
