//@ts-check

import nextra from 'nextra';
import i18n from './i18n-config.js';

const withNextra = nextra({
  contentDirBasePath: '/docs',
  defaultShowCopyCode: true,
})

export default withNextra({
  i18n,
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
    ]
  },
})
