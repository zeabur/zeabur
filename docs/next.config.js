//@ts-check

import nextra from 'nextra';
import i18n from './i18n-config.js';

const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.js',
  defaultShowCopyCode: true,
})

export default withNextra({
  i18n,
  basePath: '/docs',
  async redirects() {
    const templateDocsMap = {
      'dragonfly': 'UKMPPL',
      'flowise': '2JYZTR',
      'focalboard': 'SU7RTR',
      'ghost': 'SHEU50',
      'halo': 'Q6H2MA',
      'likit': 'KZOLHA',
      'linkwarden': '1E5ABT',
      'logto': 'AV1NZ4',
      'memos': 'KIJROJ',
      'mongodb': 'KXL04P',
      'mysql': 'DGLGRG',
      'n8n': 'W2H4RW',
      'postgresql': 'B20CX0',
      'rabbitmq': 'QAQWVO',
      'redis': 'KQZHXT',
      'rsshub': 'X46PTP',
      'ttrss': 'F1A1Y2',
      'umami': '01NQCC',
      'uptime-kuma': 'Q764RP',
      'wewe-rss': 'DI9BBD',
      'wordpress': 'CV344X',
    };

    const templateRedirectsRule = Object.entries(templateDocsMap).filter(([_, code]) => code !== null).map(([template, code]) => {
      return [
        {
          source: `/marketplace/${template}`,
          destination: `https://zeabur.com/templates/${code}`,
          permanent: true,
        },
        {
          source: `/:locale/marketplace/${template}`,
          destination: `https://zeabur.com/:locale/templates/${code}`,
          permanent: true,
        },
      ]
    }).flat();

    return templateRedirectsRule.concat([
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
      },

      // The GUI of Create Template is temporarily removed
      // since it is unmaintained. We may add it back in the future.
      {
        source: '/template/create-template',
        destination: '/template/template-in-code',
        permanent: false,
      },
      {
        source: '/:locale/template/create-template',
        destination: '/:locale/template/template-in-code',
        permanent: false,
      },

      // deploy -> data management
      {
        source: '/deploy/backup',
        destination: '/data-management/backup',
        permanent: true,
      },
      {
        source: '/:locale/deploy/backup',
        destination: '/:locale/data-management/backup',
        permanent: true,
      },
      {
        source: '/deploy/config-edit',
        destination: '/data-management/config-edit',
        permanent: true,
      },
      {
        source: '/:locale/deploy/config-edit',
        destination: '/:locale/data-management/config-edit',
        permanent: true,
      },
      {
        source: '/deploy/file-management',
        destination: '/data-management/file-management',
        permanent: true,
      },
      {
        source: '/:locale/deploy/file-management',
        destination: '/:locale/data-management/file-management',
        permanent: true,
      },
      {
        source: '/deploy/special-variables',
        destination: '/deploy/variables',
        permanent: true,
      },
      {
        source: '/:locale/deploy/special-variables',
        destination: '/:locale/deploy/variables',
        permanent: true,
      },
    ]);
  },
})
