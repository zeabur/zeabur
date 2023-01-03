const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.js',
  unstable_staticImage: true,
});

module.exports = withNextra({
  i18n: {
    locales: ['en-US', 'zh-TW', 'zh-CN'],
    defaultLocale: 'en-US',
    domains: [
      {
        domain: 'docs.zeabur.com',
        defaultLocale: 'en-US',
      },
      {
        domain: 'docs.zeabur.tw',
        defaultLocale: 'zh-TW',
      },
      {
        domain: 'docs.zeabur.cn',
        defaultLocale: 'zh-CN',
      },
    ],
  },
})
