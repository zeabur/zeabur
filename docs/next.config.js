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
        destination: '/infrastructure/public-networking',
        permanent: true,
      },
      {
        source: '/:locale/deploy/domain-binding',
        destination: '/:locale/infrastructure/public-networking',
        permanent: true,
      },
      {
        source: '/deploy/private-networking',
        destination: '/infrastructure/private-networking',
        permanent: true,
      },
      {
        source: '/:locale/deploy/private-networking',
        destination: '/:locale/infrastructure/private-networking',
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

      // deploy -> infrastructure (was data-management)
      {
        source: '/deploy/backup',
        destination: '/infrastructure/backup-restore',
        permanent: true,
      },
      {
        source: '/:locale/deploy/backup',
        destination: '/:locale/infrastructure/backup-restore',
        permanent: true,
      },
      {
        source: '/deploy/config-edit',
        destination: '/infrastructure/config-file-management',
        permanent: true,
      },
      {
        source: '/:locale/deploy/config-edit',
        destination: '/:locale/infrastructure/config-file-management',
        permanent: true,
      },
      {
        source: '/deploy/file-management',
        destination: '/infrastructure/file-management',
        permanent: true,
      },
      {
        source: '/:locale/deploy/file-management',
        destination: '/:locale/infrastructure/file-management',
        permanent: true,
      },
      {
        source: '/deploy/special-variables',
        destination: '/deploy/environment-variables',
        permanent: true,
      },
      {
        source: '/:locale/deploy/special-variables',
        destination: '/:locale/deploy/environment-variables',
        permanent: true,
      },

      // billing -> rewards (was community)
      {
        source: '/billing/referral',
        destination: '/rewards/referral',
        permanent: true,
      },
      {
        source: '/:locale/billing/referral',
        destination: '/:locale/rewards/referral',
        permanent: true,
      },
      {
        source: '/billing/reward',
        destination: '/rewards/reward',
        permanent: true,
      },
      {
        source: '/:locale/billing/reward',
        destination: '/:locale/rewards/reward',
        permanent: true,
      },

      // billing-legal flatten: pricing, rewards, legal moved to root
      {
        source: '/billing-legal/pricing/:path*',
        destination: '/pricing/:path*',
        permanent: true,
      },
      {
        source: '/:locale/billing-legal/pricing/:path*',
        destination: '/:locale/pricing/:path*',
        permanent: true,
      },
      {
        source: '/billing-legal/rewards/:path*',
        destination: '/rewards/:path*',
        permanent: true,
      },
      {
        source: '/:locale/billing-legal/rewards/:path*',
        destination: '/:locale/rewards/:path*',
        permanent: true,
      },
      {
        source: '/billing-legal/legal/:path*',
        destination: '/legal/:path*',
        permanent: true,
      },
      {
        source: '/:locale/billing-legal/legal/:path*',
        destination: '/:locale/legal/:path*',
        permanent: true,
      },
      {
        source: '/billing-legal',
        destination: '/pricing/pricing-plans',
        permanent: true,
      },
      {
        source: '/:locale/billing-legal',
        destination: '/:locale/pricing/pricing-plans',
        permanent: true,
      },

      // infrastructure/dedicated-server -> dedicated-server (moved to root)
      {
        source: '/infrastructure/dedicated-server/:path*',
        destination: '/dedicated-server/:path*',
        permanent: true,
      },
      {
        source: '/:locale/infrastructure/dedicated-server/:path*',
        destination: '/:locale/dedicated-server/:path*',
        permanent: true,
      },

      // ═══════════════════════════════════════════════════════════════
      // IA Restructure: deleted file redirects (zero-404 guarantee)
      // ═══════════════════════════════════════════════════════════════

      // deploy renames
      { source: '/deploy/variables',              destination: '/deploy/environment-variables', permanent: true },
      { source: '/:locale/deploy/variables',       destination: '/:locale/deploy/environment-variables', permanent: true },
      { source: '/deploy/github',                 destination: '/deploy/github-integration', permanent: true },
      { source: '/:locale/deploy/github',          destination: '/:locale/deploy/github-integration', permanent: true },
      { source: '/deploy/customize-prebuilt',      destination: '/deploy/custom-docker-image', permanent: true },
      { source: '/:locale/deploy/customize-prebuilt', destination: '/:locale/deploy/custom-docker-image', permanent: true },
      { source: '/deploy/deploy-in-cli',           destination: '/developer/cli', permanent: true },
      { source: '/:locale/deploy/deploy-in-cli',    destination: '/:locale/developer/cli', permanent: true },

      // developer renames
      { source: '/developer/use-api-key',          destination: '/developer/api-keys', permanent: true },
      { source: '/:locale/developer/use-api-key',   destination: '/:locale/developer/api-keys', permanent: true },

      // legal renames
      { source: '/legal/terms',                    destination: '/legal/terms-of-service', permanent: true },
      { source: '/:locale/legal/terms',             destination: '/:locale/legal/terms-of-service', permanent: true },
      { source: '/legal/privacy',                  destination: '/legal/privacy-policy', permanent: true },
      { source: '/:locale/legal/privacy',           destination: '/:locale/legal/privacy-policy', permanent: true },
      { source: '/legal/fair-use-guideline',        destination: '/legal/fair-use-guidelines', permanent: true },
      { source: '/:locale/legal/fair-use-guideline', destination: '/:locale/legal/fair-use-guidelines', permanent: true },

      // ═══════════════════════════════════════════════════════════════
      // IA Restructure: old hidden dirs → new canonical paths
      // ═══════════════════════════════════════════════════════════════

      // data-management → infrastructure
      { source: '/data-management/volumes',              destination: '/infrastructure/volumes', permanent: true },
      { source: '/:locale/data-management/volumes',       destination: '/:locale/infrastructure/volumes', permanent: true },
      { source: '/data-management/config-edit',           destination: '/infrastructure/config-file-management', permanent: true },
      { source: '/:locale/data-management/config-edit',    destination: '/:locale/infrastructure/config-file-management', permanent: true },
      { source: '/data-management/file-management',       destination: '/infrastructure/file-management', permanent: true },
      { source: '/:locale/data-management/file-management', destination: '/:locale/infrastructure/file-management', permanent: true },
      { source: '/data-management/backup',                destination: '/infrastructure/backup-restore', permanent: true },
      { source: '/:locale/data-management/backup',         destination: '/:locale/infrastructure/backup-restore', permanent: true },
      { source: '/data-management/restore',               destination: '/infrastructure/backup-restore', permanent: true },
      { source: '/:locale/data-management/restore',        destination: '/:locale/infrastructure/backup-restore', permanent: true },

      // networking → infrastructure
      { source: '/networking/public',                     destination: '/infrastructure/public-networking', permanent: true },
      { source: '/:locale/networking/public',              destination: '/:locale/infrastructure/public-networking', permanent: true },
      { source: '/networking/private',                    destination: '/infrastructure/private-networking', permanent: true },
      { source: '/:locale/networking/private',             destination: '/:locale/infrastructure/private-networking', permanent: true },
      { source: '/networking/high-availability',           destination: '/infrastructure/high-availability', permanent: true },
      { source: '/:locale/networking/high-availability',    destination: '/:locale/infrastructure/high-availability', permanent: true },

      // manage → operations
      { source: '/manage/metric',                         destination: '/operations/metrics', permanent: true },
      { source: '/:locale/manage/metric',                  destination: '/:locale/operations/metrics', permanent: true },
      { source: '/manage/invite',                         destination: '/operations/invite-member', permanent: true },
      { source: '/:locale/manage/invite',                  destination: '/:locale/operations/invite-member', permanent: true },
      { source: '/manage/budget',                         destination: '/operations/project-budget', permanent: true },
      { source: '/:locale/manage/budget',                  destination: '/:locale/operations/project-budget', permanent: true },
      { source: '/manage/security-report',                destination: '/operations/security-report', permanent: true },
      { source: '/:locale/manage/security-report',         destination: '/:locale/operations/security-report', permanent: true },

      // billing → pricing / rewards
      { source: '/billing/pricing',                       destination: '/pricing/pricing-plans', permanent: true },
      { source: '/:locale/billing/pricing',                destination: '/:locale/pricing/pricing-plans', permanent: true },
      { source: '/billing/plans',                         destination: '/pricing/pricing-plans', permanent: true },
      { source: '/:locale/billing/plans',                  destination: '/:locale/pricing/pricing-plans', permanent: true },
      { source: '/billing/subscription',                  destination: '/pricing/subscription-billing', permanent: true },
      { source: '/:locale/billing/subscription',           destination: '/:locale/pricing/subscription-billing', permanent: true },
      { source: '/billing/sponsor',                       destination: '/rewards/sponsor', permanent: true },
      { source: '/:locale/billing/sponsor',                destination: '/:locale/rewards/sponsor', permanent: true },
      { source: '/billing/redeem',                        destination: '/rewards/redeem-card', permanent: true },
      { source: '/:locale/billing/redeem',                 destination: '/:locale/rewards/redeem-card', permanent: true },

      // community → rewards / faq-support
      { source: '/community/referral',                    destination: '/rewards/referral', permanent: true },
      { source: '/:locale/community/referral',             destination: '/:locale/rewards/referral', permanent: true },
      { source: '/community/contribution',                destination: '/rewards/reward', permanent: true },
      { source: '/:locale/community/contribution',         destination: '/:locale/rewards/reward', permanent: true },
      { source: '/community/verify',                      destination: '/get-started/faq-support/verify', permanent: true },
      { source: '/:locale/community/verify',               destination: '/:locale/get-started/faq-support/verify', permanent: true },
      { source: '/community/help',                        destination: '/get-started/faq-support/help', permanent: true },
      { source: '/:locale/community/help',                 destination: '/:locale/get-started/faq-support/help', permanent: true },
      { source: '/community/forum',                       destination: '/get-started/faq-support', permanent: true },
      { source: '/:locale/community/forum',                destination: '/:locale/get-started/faq-support', permanent: true },

      // ═══════════════════════════════════════════════════════════════
      // Root-level directory redirects (bare /dir → canonical landing)
      // ═══════════════════════════════════════════════════════════════
      { source: '/billing',            destination: '/pricing/pricing-plans',   permanent: true },
      { source: '/:locale/billing',     destination: '/:locale/pricing/pricing-plans', permanent: true },
      { source: '/manage',             destination: '/operations',              permanent: true },
      { source: '/:locale/manage',      destination: '/:locale/operations',      permanent: true },
      { source: '/community',          destination: '/get-started/faq-support', permanent: true },
      { source: '/:locale/community',   destination: '/:locale/get-started/faq-support', permanent: true },
      { source: '/data-management',    destination: '/infrastructure',          permanent: true },
      { source: '/:locale/data-management', destination: '/:locale/infrastructure', permanent: true },
      { source: '/networking',         destination: '/infrastructure',          permanent: true },
      { source: '/:locale/networking',  destination: '/:locale/infrastructure',  permanent: true },
    ]);
  },
})
