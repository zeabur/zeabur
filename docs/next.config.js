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
        destination: '/deploy/public-networking',
        permanent: true,
      },
      {
        source: '/:locale/deploy/domain-binding',
        destination: '/:locale/deploy/public-networking',
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
        destination: '/operations/backup-restore',
        permanent: true,
      },
      {
        source: '/:locale/deploy/backup',
        destination: '/:locale/operations/backup-restore',
        permanent: true,
      },
      {
        source: '/deploy/config-edit',
        destination: '/operations/config-file-management',
        permanent: true,
      },
      {
        source: '/:locale/deploy/config-edit',
        destination: '/:locale/operations/config-file-management',
        permanent: true,
      },
      {
        source: '/deploy/file-management',
        destination: '/operations/file-management',
        permanent: true,
      },
      {
        source: '/:locale/deploy/file-management',
        destination: '/:locale/operations/file-management',
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
      // billing-legal/legal → dissolved locations (avoid redirect chains)
      { source: '/billing-legal/legal/privacy-policy',       destination: '/privacy-policy', permanent: true },
      { source: '/:locale/billing-legal/legal/privacy-policy', destination: '/:locale/privacy-policy', permanent: true },
      { source: '/billing-legal/legal/privacy',              destination: '/privacy-policy', permanent: true },
      { source: '/:locale/billing-legal/legal/privacy',       destination: '/:locale/privacy-policy', permanent: true },
      { source: '/billing-legal/legal/terms-of-service',     destination: '/terms-of-service', permanent: true },
      { source: '/:locale/billing-legal/legal/terms-of-service', destination: '/:locale/terms-of-service', permanent: true },
      { source: '/billing-legal/legal/terms',                destination: '/terms-of-service', permanent: true },
      { source: '/:locale/billing-legal/legal/terms',         destination: '/:locale/terms-of-service', permanent: true },
      { source: '/billing-legal/legal/fair-use-guidelines',  destination: '/compliance/fair-use-guidelines', permanent: true },
      { source: '/:locale/billing-legal/legal/fair-use-guidelines', destination: '/:locale/compliance/fair-use-guidelines', permanent: true },
      { source: '/billing-legal/legal/fair-use-guideline',   destination: '/compliance/fair-use-guidelines', permanent: true },
      { source: '/:locale/billing-legal/legal/fair-use-guideline', destination: '/:locale/compliance/fair-use-guidelines', permanent: true },
      { source: '/billing-legal/legal/abuse-report',         destination: '/compliance/abuse-report', permanent: true },
      { source: '/:locale/billing-legal/legal/abuse-report',  destination: '/:locale/compliance/abuse-report', permanent: true },
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

      // legal → standalone pages / compliance (dissolved)
      { source: '/legal/terms',                    destination: '/terms-of-service', permanent: true },
      { source: '/:locale/legal/terms',             destination: '/:locale/terms-of-service', permanent: true },
      { source: '/legal/terms-of-service',          destination: '/terms-of-service', permanent: true },
      { source: '/:locale/legal/terms-of-service',  destination: '/:locale/terms-of-service', permanent: true },
      { source: '/legal/privacy',                  destination: '/privacy-policy', permanent: true },
      { source: '/:locale/legal/privacy',           destination: '/:locale/privacy-policy', permanent: true },
      { source: '/legal/privacy-policy',            destination: '/privacy-policy', permanent: true },
      { source: '/:locale/legal/privacy-policy',    destination: '/:locale/privacy-policy', permanent: true },
      { source: '/legal/fair-use-guideline',        destination: '/compliance/fair-use-guidelines', permanent: true },
      { source: '/:locale/legal/fair-use-guideline', destination: '/:locale/compliance/fair-use-guidelines', permanent: true },
      { source: '/legal/fair-use-guidelines',       destination: '/compliance/fair-use-guidelines', permanent: true },
      { source: '/:locale/legal/fair-use-guidelines', destination: '/:locale/compliance/fair-use-guidelines', permanent: true },
      { source: '/legal/abuse-report',              destination: '/compliance/abuse-report', permanent: true },
      { source: '/:locale/legal/abuse-report',       destination: '/:locale/compliance/abuse-report', permanent: true },
      { source: '/legal',                           destination: '/privacy-policy', permanent: true },
      { source: '/:locale/legal',                    destination: '/:locale/privacy-policy', permanent: true },

      // pricing/subscription-billing → subscription
      { source: '/pricing/subscription-billing',     destination: '/subscription', permanent: true },
      { source: '/:locale/pricing/subscription-billing', destination: '/:locale/subscription', permanent: true },

      // ═══════════════════════════════════════════════════════════════
      // IA Restructure: old hidden dirs → new canonical paths
      // ═══════════════════════════════════════════════════════════════

      // data-management → operations (storage)
      { source: '/data-management/volumes',              destination: '/operations/volumes', permanent: true },
      { source: '/:locale/data-management/volumes',       destination: '/:locale/operations/volumes', permanent: true },
      { source: '/data-management/config-edit',           destination: '/operations/config-file-management', permanent: true },
      { source: '/:locale/data-management/config-edit',    destination: '/:locale/operations/config-file-management', permanent: true },
      { source: '/data-management/file-management',       destination: '/operations/file-management', permanent: true },
      { source: '/:locale/data-management/file-management', destination: '/:locale/operations/file-management', permanent: true },
      { source: '/data-management/backup',                destination: '/operations/backup-restore', permanent: true },
      { source: '/:locale/data-management/backup',         destination: '/:locale/operations/backup-restore', permanent: true },
      { source: '/data-management/restore',               destination: '/operations/backup-restore', permanent: true },
      { source: '/:locale/data-management/restore',        destination: '/:locale/operations/backup-restore', permanent: true },

      // networking → deploy (networking)
      { source: '/networking/public',                     destination: '/deploy/public-networking', permanent: true },
      { source: '/:locale/networking/public',              destination: '/:locale/deploy/public-networking', permanent: true },
      { source: '/networking/private',                    destination: '/deploy/private-networking', permanent: true },
      { source: '/:locale/networking/private',             destination: '/:locale/deploy/private-networking', permanent: true },
      { source: '/networking/high-availability',           destination: '/deploy/high-availability', permanent: true },
      { source: '/:locale/networking/high-availability',    destination: '/:locale/deploy/high-availability', permanent: true },

      // infrastructure → new locations (dissolved)
      { source: '/infrastructure/volumes',               destination: '/operations/volumes', permanent: true },
      { source: '/:locale/infrastructure/volumes',        destination: '/:locale/operations/volumes', permanent: true },
      { source: '/infrastructure/file-management',       destination: '/operations/file-management', permanent: true },
      { source: '/:locale/infrastructure/file-management', destination: '/:locale/operations/file-management', permanent: true },
      { source: '/infrastructure/backup-restore',        destination: '/operations/backup-restore', permanent: true },
      { source: '/:locale/infrastructure/backup-restore', destination: '/:locale/operations/backup-restore', permanent: true },
      { source: '/infrastructure/config-file-management', destination: '/operations/config-file-management', permanent: true },
      { source: '/:locale/infrastructure/config-file-management', destination: '/:locale/operations/config-file-management', permanent: true },
      { source: '/infrastructure/public-networking',     destination: '/deploy/public-networking', permanent: true },
      { source: '/:locale/infrastructure/public-networking', destination: '/:locale/deploy/public-networking', permanent: true },
      { source: '/infrastructure/private-networking',    destination: '/deploy/private-networking', permanent: true },
      { source: '/:locale/infrastructure/private-networking', destination: '/:locale/deploy/private-networking', permanent: true },
      { source: '/infrastructure/high-availability',     destination: '/deploy/high-availability', permanent: true },
      { source: '/:locale/infrastructure/high-availability', destination: '/:locale/deploy/high-availability', permanent: true },
      { source: '/infrastructure/edge-caching',          destination: '/deploy/edge-caching', permanent: true },
      { source: '/:locale/infrastructure/edge-caching',   destination: '/:locale/deploy/edge-caching', permanent: true },

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
      { source: '/billing/subscription',                  destination: '/subscription', permanent: true },
      { source: '/:locale/billing/subscription',           destination: '/:locale/subscription', permanent: true },
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
      { source: '/data-management',    destination: '/operations',              permanent: true },
      { source: '/:locale/data-management', destination: '/:locale/operations', permanent: true },
      { source: '/networking',         destination: '/deploy',                  permanent: true },
      { source: '/:locale/networking',  destination: '/:locale/deploy',          permanent: true },
      { source: '/infrastructure',     destination: '/deploy',                  permanent: true },
      { source: '/:locale/infrastructure', destination: '/:locale/deploy',      permanent: true },

      // ── Tutorials → Migration ──
      { source: '/tutorials/replit',    destination: '/get-started/migration/replit',   permanent: true },
      { source: '/:locale/tutorials/replit', destination: '/:locale/get-started/migration/replit', permanent: true },
      { source: '/tutorials/lovable',   destination: '/get-started/migration/lovable',  permanent: true },
      { source: '/:locale/tutorials/lovable', destination: '/:locale/get-started/migration/lovable', permanent: true },
      { source: '/tutorials/bolt',      destination: '/get-started/migration/bolt',     permanent: true },
      { source: '/:locale/tutorials/bolt', destination: '/:locale/get-started/migration/bolt', permanent: true },
      { source: '/tutorials/emergent',  destination: '/get-started/migration/emergent', permanent: true },
      { source: '/:locale/tutorials/emergent', destination: '/:locale/get-started/migration/emergent', permanent: true },
      { source: '/tutorials/aistudio', destination: '/get-started/migration/aistudio',  permanent: true },
      { source: '/:locale/tutorials/aistudio', destination: '/:locale/get-started/migration/aistudio', permanent: true },
      { source: '/tutorials/v0',        destination: '/get-started/migration/vercel',   permanent: true },
      { source: '/:locale/tutorials/v0', destination: '/:locale/get-started/migration/vercel', permanent: true },
      { source: '/tutorials/github',    destination: '/deploy/github-integration',      permanent: true },
      { source: '/:locale/tutorials/github', destination: '/:locale/deploy/github-integration', permanent: true },

      // ── Template fork redirect ──
      { source: '/template/fork-git-repo-from-template', destination: '/deploy/templates/fork-from-template', permanent: true },
      { source: '/:locale/template/fork-git-repo-from-template', destination: '/:locale/deploy/templates/fork-from-template', permanent: true },

      // ── Tutorials bare → get-started ──
      { source: '/tutorials',           destination: '/get-started',                    permanent: true },
      { source: '/:locale/tutorials',    destination: '/:locale/get-started',            permanent: true },
    ]);
  },
})
