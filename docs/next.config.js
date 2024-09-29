//@ts-check

import nextra from 'nextra';

const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.js',
  defaultShowCopyCode: true,
})

export default withNextra({
  i18n: {
    locales: ['en-US', 'zh-TW', 'zh-CN', 'ja-JP', 'es-ES'],
    defaultLocale: 'en-US',
  },
  basePath: '/docs',
  async redirects() {
    return [
      {
        source: '/guides/go/go',
        destination: '/guides/go',
        permanent: true,
      },
      {
        source: '/guides/rust/rust',
        destination: '/guides/rust',
        permanent: true,
      },
      {
        source: '/deploy/domain-binding',
        destination: '/networking/public',
        permanent: true,
      },
      {
        source: '/deploy/private-networking',
        destination: '/networking/private',
        permanent: true,
      }
    ]
  },
})
