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
        destination: '/deploy/networking/public-networking',
        permanent: true,
      },
      {
        source: '/:locale/deploy/domain-binding',
        destination: '/:locale/deploy/networking/public-networking',
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

      // deploy flat → deploy sub-folders
      { source: '/deploy/backup',            destination: '/operations/data/backup-restore', permanent: true },
      { source: '/:locale/deploy/backup',     destination: '/:locale/operations/data/backup-restore', permanent: true },
      { source: '/deploy/config-edit',        destination: '/operations/data/config-file-management', permanent: true },
      { source: '/:locale/deploy/config-edit', destination: '/:locale/operations/data/config-file-management', permanent: true },
      { source: '/deploy/file-management',    destination: '/operations/data/file-management', permanent: true },
      { source: '/:locale/deploy/file-management', destination: '/:locale/operations/data/file-management', permanent: true },
      { source: '/deploy/create-project',     destination: '/deploy/create/create-project', permanent: true },
      { source: '/:locale/deploy/create-project', destination: '/:locale/deploy/create/create-project', permanent: true },
      { source: '/deploy/create-service',     destination: '/deploy/create/create-service', permanent: true },
      { source: '/:locale/deploy/create-service', destination: '/:locale/deploy/create/create-service', permanent: true },
      { source: '/deploy/dockerfile',         destination: '/deploy/methods/dockerfile', permanent: true },
      { source: '/:locale/deploy/dockerfile',  destination: '/:locale/deploy/methods/dockerfile', permanent: true },
      { source: '/deploy/custom-docker-image', destination: '/deploy/methods/custom-docker-image', permanent: true },
      { source: '/:locale/deploy/custom-docker-image', destination: '/:locale/deploy/methods/custom-docker-image', permanent: true },
      { source: '/deploy/github-integration',  destination: '/deploy/methods/github-integration', permanent: true },
      { source: '/:locale/deploy/github-integration', destination: '/:locale/deploy/methods/github-integration', permanent: true },
      { source: '/deploy/deploy-button',       destination: '/deploy/methods/deploy-button', permanent: true },
      { source: '/:locale/deploy/deploy-button', destination: '/:locale/deploy/methods/deploy-button', permanent: true },
      { source: '/deploy/deploy-with-chrome-extension', destination: '/deploy/methods/deploy-with-chrome-extension', permanent: true },
      { source: '/:locale/deploy/deploy-with-chrome-extension', destination: '/:locale/deploy/methods/deploy-with-chrome-extension', permanent: true },
      { source: '/deploy/deploy-with-vscode-extension', destination: '/deploy/methods/deploy-with-vscode-extension', permanent: true },
      { source: '/:locale/deploy/deploy-with-vscode-extension', destination: '/:locale/deploy/methods/deploy-with-vscode-extension', permanent: true },
      { source: '/deploy/deploy-with-raycast-extension', destination: '/deploy/methods/deploy-with-raycast-extension', permanent: true },
      { source: '/:locale/deploy/deploy-with-raycast-extension', destination: '/:locale/deploy/methods/deploy-with-raycast-extension', permanent: true },
      { source: '/deploy/environment-variables', destination: '/deploy/config/environment-variables', permanent: true },
      { source: '/:locale/deploy/environment-variables', destination: '/:locale/deploy/config/environment-variables', permanent: true },
      { source: '/deploy/root-directory',      destination: '/deploy/config/root-directory', permanent: true },
      { source: '/:locale/deploy/root-directory', destination: '/:locale/deploy/config/root-directory', permanent: true },
      { source: '/deploy/watch-paths',         destination: '/deploy/config/watch-paths', permanent: true },
      { source: '/:locale/deploy/watch-paths',  destination: '/:locale/deploy/config/watch-paths', permanent: true },
      { source: '/deploy/command-execution',   destination: '/deploy/config/command-execution', permanent: true },
      { source: '/:locale/deploy/command-execution', destination: '/:locale/deploy/config/command-execution', permanent: true },
      { source: '/deploy/copy-project',        destination: '/deploy/manage/copy-project', permanent: true },
      { source: '/:locale/deploy/copy-project', destination: '/:locale/deploy/manage/copy-project', permanent: true },
      { source: '/deploy/export-project',      destination: '/deploy/manage/export-project', permanent: true },
      { source: '/:locale/deploy/export-project', destination: '/:locale/deploy/manage/export-project', permanent: true },
      { source: '/deploy/migrate-project',     destination: '/deploy/manage/migrate-project', permanent: true },
      { source: '/:locale/deploy/migrate-project', destination: '/:locale/deploy/manage/migrate-project', permanent: true },
      { source: '/deploy/update-image-reference', destination: '/deploy/manage/update-image-reference', permanent: true },
      { source: '/:locale/deploy/update-image-reference', destination: '/:locale/deploy/manage/update-image-reference', permanent: true },
      { source: '/deploy/public-networking',   destination: '/deploy/networking/public-networking', permanent: true },
      { source: '/:locale/deploy/public-networking', destination: '/:locale/deploy/networking/public-networking', permanent: true },
      { source: '/deploy/private-networking',  destination: '/deploy/networking/private-networking', permanent: true },
      { source: '/:locale/deploy/private-networking', destination: '/:locale/deploy/networking/private-networking', permanent: true },
      { source: '/deploy/high-availability',   destination: '/deploy/networking/high-availability', permanent: true },
      { source: '/:locale/deploy/high-availability', destination: '/:locale/deploy/networking/high-availability', permanent: true },
      { source: '/deploy/edge-caching',        destination: '/deploy/networking/edge-caching', permanent: true },
      { source: '/:locale/deploy/edge-caching', destination: '/:locale/deploy/networking/edge-caching', permanent: true },

      // operations flat → operations sub-folders
      { source: '/operations/invite-member',   destination: '/operations/team/invite-member', permanent: true },
      { source: '/:locale/operations/invite-member', destination: '/:locale/operations/team/invite-member', permanent: true },
      { source: '/operations/security-report', destination: '/operations/team/security-report', permanent: true },
      { source: '/:locale/operations/security-report', destination: '/:locale/operations/team/security-report', permanent: true },
      { source: '/operations/service-usage',   destination: '/operations/resources/service-usage', permanent: true },
      { source: '/:locale/operations/service-usage', destination: '/:locale/operations/resources/service-usage', permanent: true },
      { source: '/operations/project-budget',  destination: '/operations/resources/project-budget', permanent: true },
      { source: '/:locale/operations/project-budget', destination: '/:locale/operations/resources/project-budget', permanent: true },
      { source: '/operations/scaling',         destination: '/operations/resources/scaling', permanent: true },
      { source: '/:locale/operations/scaling',  destination: '/:locale/operations/resources/scaling', permanent: true },
      { source: '/operations/previews',        destination: '/operations/deployment/previews', permanent: true },
      { source: '/:locale/operations/previews', destination: '/:locale/operations/deployment/previews', permanent: true },
      { source: '/operations/rollbacks',       destination: '/operations/deployment/rollbacks', permanent: true },
      { source: '/:locale/operations/rollbacks', destination: '/:locale/operations/deployment/rollbacks', permanent: true },
      { source: '/operations/maintenance-mode', destination: '/operations/deployment/maintenance-mode', permanent: true },
      { source: '/:locale/operations/maintenance-mode', destination: '/:locale/operations/deployment/maintenance-mode', permanent: true },
      { source: '/operations/health-checks',   destination: '/operations/monitoring/health-checks', permanent: true },
      { source: '/:locale/operations/health-checks', destination: '/:locale/operations/monitoring/health-checks', permanent: true },
      { source: '/operations/logging',         destination: '/operations/monitoring/logging', permanent: true },
      { source: '/:locale/operations/logging',  destination: '/:locale/operations/monitoring/logging', permanent: true },
      { source: '/operations/metrics',         destination: '/operations/monitoring/metrics', permanent: true },
      { source: '/:locale/operations/metrics',  destination: '/:locale/operations/monitoring/metrics', permanent: true },
      { source: '/operations/volumes',         destination: '/operations/data/volumes', permanent: true },
      { source: '/:locale/operations/volumes',  destination: '/:locale/operations/data/volumes', permanent: true },
      { source: '/operations/file-management', destination: '/operations/data/file-management', permanent: true },
      { source: '/:locale/operations/file-management', destination: '/:locale/operations/data/file-management', permanent: true },
      { source: '/operations/backup-restore',  destination: '/operations/data/backup-restore', permanent: true },
      { source: '/:locale/operations/backup-restore', destination: '/:locale/operations/data/backup-restore', permanent: true },
      { source: '/operations/config-file-management', destination: '/operations/data/config-file-management', permanent: true },
      { source: '/:locale/operations/config-file-management', destination: '/:locale/operations/data/config-file-management', permanent: true },
      {
        source: '/deploy/special-variables',
        destination: '/deploy/config/environment-variables',
        permanent: true,
      },
      {
        source: '/:locale/deploy/special-variables',
        destination: '/:locale/deploy/config/environment-variables',
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
      { source: '/deploy/variables',              destination: '/deploy/config/environment-variables', permanent: true },
      { source: '/:locale/deploy/variables',       destination: '/:locale/deploy/config/environment-variables', permanent: true },
      { source: '/deploy/github',                 destination: '/deploy/methods/github-integration', permanent: true },
      { source: '/:locale/deploy/github',          destination: '/:locale/deploy/methods/github-integration', permanent: true },
      { source: '/deploy/customize-prebuilt',      destination: '/deploy/methods/custom-docker-image', permanent: true },
      { source: '/:locale/deploy/customize-prebuilt', destination: '/:locale/deploy/methods/custom-docker-image', permanent: true },
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

      // data-management and networking are now canonical L1 locations
      // (old redirects removed — these directories are visible again)

      // infrastructure → new sub-folder locations
      { source: '/infrastructure/volumes',               destination: '/operations/data/volumes', permanent: true },
      { source: '/:locale/infrastructure/volumes',        destination: '/:locale/operations/data/volumes', permanent: true },
      { source: '/infrastructure/file-management',       destination: '/operations/data/file-management', permanent: true },
      { source: '/:locale/infrastructure/file-management', destination: '/:locale/operations/data/file-management', permanent: true },
      { source: '/infrastructure/backup-restore',        destination: '/operations/data/backup-restore', permanent: true },
      { source: '/:locale/infrastructure/backup-restore', destination: '/:locale/operations/data/backup-restore', permanent: true },
      { source: '/infrastructure/config-file-management', destination: '/operations/data/config-file-management', permanent: true },
      { source: '/:locale/infrastructure/config-file-management', destination: '/:locale/operations/data/config-file-management', permanent: true },
      { source: '/infrastructure/public-networking',     destination: '/deploy/networking/public-networking', permanent: true },
      { source: '/:locale/infrastructure/public-networking', destination: '/:locale/deploy/networking/public-networking', permanent: true },
      { source: '/infrastructure/private-networking',    destination: '/deploy/networking/private-networking', permanent: true },
      { source: '/:locale/infrastructure/private-networking', destination: '/:locale/deploy/networking/private-networking', permanent: true },
      { source: '/infrastructure/high-availability',     destination: '/deploy/networking/high-availability', permanent: true },
      { source: '/:locale/infrastructure/high-availability', destination: '/:locale/deploy/networking/high-availability', permanent: true },
      { source: '/infrastructure/edge-caching',          destination: '/deploy/networking/edge-caching', permanent: true },
      { source: '/:locale/infrastructure/edge-caching',   destination: '/:locale/deploy/networking/edge-caching', permanent: true },

      // manage → operations
      { source: '/manage/metric',                         destination: '/operations/monitoring/metrics', permanent: true },
      { source: '/:locale/manage/metric',                  destination: '/:locale/operations/monitoring/metrics', permanent: true },
      { source: '/manage/invite',                         destination: '/operations/team/invite-member', permanent: true },
      { source: '/:locale/manage/invite',                  destination: '/:locale/operations/team/invite-member', permanent: true },
      { source: '/manage/budget',                         destination: '/operations/resources/project-budget', permanent: true },
      { source: '/:locale/manage/budget',                  destination: '/:locale/operations/resources/project-budget', permanent: true },
      { source: '/manage/security-report',                destination: '/operations/team/security-report', permanent: true },
      { source: '/:locale/manage/security-report',         destination: '/:locale/operations/team/security-report', permanent: true },

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
      // data-management and networking are now visible L1 — no root redirects needed
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
      { source: '/tutorials/github',    destination: '/deploy/methods/github-integration', permanent: true },
      { source: '/:locale/tutorials/github', destination: '/:locale/deploy/methods/github-integration', permanent: true },

      // ── Template fork redirect ──
      { source: '/template/fork-git-repo-from-template', destination: '/deploy/templates/template-format', permanent: true },
      { source: '/:locale/template/fork-git-repo-from-template', destination: '/:locale/deploy/templates/template-format', permanent: true },
      { source: '/deploy/templates/fork-from-template', destination: '/deploy/templates/template-format', permanent: true },
      { source: '/:locale/deploy/templates/fork-from-template', destination: '/:locale/deploy/templates/template-format', permanent: true },

      // ── Tutorials bare → get-started ──
      { source: '/tutorials',           destination: '/get-started',                    permanent: true },
      { source: '/:locale/tutorials',    destination: '/:locale/get-started',            permanent: true },
    ]);
  },
})
