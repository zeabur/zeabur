const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.js',
  unstable_staticImage: true,
  defaultShowCopyCode: true,
})

module.exports = withNextra({
  i18n: {
    locales: ['en-US', 'zh-TW', 'zh-CN', 'jp'],
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
    ]
  },
})
