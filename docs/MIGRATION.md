# Zeabur Docs IA Restructure — Migration Script

> Generated: 2026-03-10
> Scope: zh-TW + en-US (primary), ja-JP / zh-CN / es-ES (deferred)
> Production baseline: `zeabur.com/docs` (current live)

---

## 0. Executive Summary

This migration restructures the Zeabur docs from a flat feature-based IA to a **Server → Project → Service** product-granularity model. The changes affect **zh-TW and en-US only** in this phase; ja-JP, zh-CN, es-ES remain on the old structure (hidden directories ensure backward compatibility).

**Key numbers:**
- Production pages: ~130 unique paths × 5 locales
- Deleted files (zh-TW/en-US): 13 files (6 file→folder auto-resolved, 7 need redirects)
- New files (zh-TW/en-US): ~65 files
- Redirect rules added: 76 rules (all implemented in `next.config.js`)
- Content gaps: 0 (all resolved)

---

## 1. Complete URL Redirect Map

### 1A. CRITICAL — Files DELETED, redirects IMPLEMENTED ✅

These files were deleted from zh-TW/en-US. All have 301 redirects in `next.config.js`.

| # | Old URL (production) | New URL (redirect target) | Type | Status |
|---|---|---|---|---|
| 1 | `/deploy/variables` | `/deploy/environment-variables` | Renamed | ✅ Redirect |
| 2 | `/deploy/github` | `/deploy/github-integration` | Renamed | ✅ Redirect |
| 3 | `/deploy/customize-prebuilt` | `/deploy/custom-docker-image` | Renamed | ✅ Redirect |
| 4 | `/deploy/deploy-in-cli` | `/developer/cli` | Moved + renamed | ✅ Redirect |
| 5 | `/deploy/deploy-with-raycast-extension` | `/deploy/deploy-with-raycast-extension` | **Restored** | ✅ File restored from git |
| 6 | `/deploy/deploy-with-vscode-extension` | `/deploy/deploy-with-vscode-extension` | **Restored** | ✅ File restored from git |
| 7 | `/developer/use-api-key` | `/developer/api-keys` | Renamed | ✅ Redirect |
| 8 | `/legal/terms` (zh-TW) | `/legal/terms-of-service` | Renamed | ✅ Redirect |
| 9 | `/legal/privacy` (zh-TW) | `/legal/privacy-policy` | Renamed | ✅ Redirect |
| 10 | `/legal/fair-use-guideline` (zh-TW) | `/legal/fair-use-guidelines` | Renamed | ✅ Redirect |
| 11 | `/get-started` (was flat page) | `/get-started/` (folder index) | File → folder | ✅ Auto-resolved |
| 12 | `/ai-hub` (was flat page) | `/ai-hub/` (folder index) | File → folder | ✅ Auto-resolved |
| 13 | `/dedicated-server` (was flat page) | `/dedicated-server/` (folder index) | File → folder | ✅ Auto-resolved |

### 1B. Old hidden directories → New canonical paths — IMPLEMENTED ✅

Old files still exist on disk (hidden from sidebar), but redirects in `next.config.js` route users to canonical pages. Next.js evaluates redirects before file routes.

| # | Old URL (hidden, stale) | New URL (canonical) | Status |
|---|---|---|---|
| 14 | `/data-management/volumes` | `/infrastructure/volumes` | ✅ Redirect |
| 15 | `/data-management/config-edit` | `/infrastructure/config-file-management` | ✅ Redirect |
| 16 | `/data-management/file-management` | `/infrastructure/file-management` | ✅ Redirect |
| 17 | `/data-management/backup` | `/infrastructure/backup-restore` | ✅ Redirect |
| 18 | `/data-management/restore` | `/infrastructure/backup-restore` | ✅ Redirect |
| 19 | `/networking/public` | `/infrastructure/public-networking` | ✅ Redirect |
| 20 | `/networking/private` | `/infrastructure/private-networking` | ✅ Redirect |
| 21 | `/networking/high-availability` | `/infrastructure/high-availability` | ✅ Redirect |
| 22 | `/manage/metric` | `/operations/metrics` | ✅ Redirect |
| 23 | `/manage/invite` | `/operations/invite-member` | ✅ Redirect |
| 24 | `/manage/budget` | `/operations/project-budget` | ✅ Redirect |
| 25 | `/manage/security-report` | `/operations/security-report` | ✅ Redirect |
| 26 | `/billing/pricing` | `/pricing/pricing-plans` | ✅ Redirect |
| 27 | `/billing/plans` | `/pricing/pricing-plans` | ✅ Redirect |
| 28 | `/billing/subscription` | `/pricing/subscription-billing` | ✅ Redirect |
| 29 | `/billing/sponsor` | `/rewards/sponsor` | ✅ Redirect |
| 30 | `/billing/redeem` | `/rewards/redeem-card` | ✅ Redirect |
| 31 | `/community/referral` | `/rewards/referral` | ✅ Redirect |
| 32 | `/community/contribution` | `/rewards/reward` | ✅ Redirect |
| 33 | `/community/verify` | `/get-started/faq-support/verify` | ✅ Redirect |
| 34 | `/community/help` | `/get-started/faq-support/help` | ✅ Redirect |
| 35 | `/community/forum` | `/get-started/faq-support` | ✅ Redirect |

### 1C. EXISTING REDIRECT CHAINS — UPDATED ✅

All existing redirect chains in `next.config.js` have been updated to point directly to their final canonical destinations.

| Existing redirect | Old destination | Updated destination | Status |
|---|---|---|---|
| `/deploy/special-variables` | `/deploy/variables` ⛔ 404 | `/deploy/environment-variables` | ✅ Fixed |
| `/deploy/domain-binding` | `/networking/public` (stale) | `/infrastructure/public-networking` | ✅ Fixed |
| `/deploy/private-networking` | `/networking/private` (stale) | `/infrastructure/private-networking` | ✅ Fixed |
| `/deploy/backup` | `/data-management/backup` (stale) | `/infrastructure/backup-restore` | ✅ Fixed |
| `/deploy/config-edit` | `/data-management/config-edit` (stale) | `/infrastructure/config-file-management` | ✅ Fixed |
| `/deploy/file-management` | `/data-management/file-management` (stale) | `/infrastructure/file-management` | ✅ Fixed |
| `/billing/referral` | `/community/referral` (stale) | `/rewards/referral` | ✅ Fixed |
| `/billing/reward` | `/community/contribution` (stale) | `/rewards/reward` | ✅ Fixed |

---

## 2. Content Gaps — ALL RESOLVED ✅

### 2A. Previously Missing Content — Fixed

| # | Issue | Resolution | Status |
|---|---|---|---|
| **G1** | `deploy/deploy-with-raycast-extension` deleted | Raycast Extension is **active** (85 installs, updated 2026-03-01). File restored from git, added to `deploy/_meta.ts`. | ✅ Resolved |
| **G2** | `deploy/deploy-with-vscode-extension` deleted | VS Code Extension is **active** (v0.2.4, 1,404 installs). File restored from git, added to `deploy/_meta.ts`. | ✅ Resolved |
| **G3** | `en-US/rewards/` directory missing | Created `en-US/rewards/` with `_meta.ts` + 4 .mdx files (redeem-card, referral, reward, sponsor). | ✅ Resolved |
| **G4** | `community/forum` not migrated | Redirect added: `/community/forum` → `/get-started/faq-support` | ✅ Resolved |

### 2B. CONTENT NOT MIGRATED (but still accessible via hidden directories)

These pages exist in hidden directories and still render by direct URL. They just don't appear in the sidebar. Decide per item whether to migrate or leave.

| Page | Current location (hidden) | Suggested destination | Priority |
|---|---|---|---|
| `tutorials/v0` | `/tutorials/v0` | `/get-started/migration/v0` | Medium — v0 is an AI deployment tool |
| `tutorials/github` | `/tutorials/github` | `/get-started/migration/github` | Medium — GitHub import tutorial |
| `advanced/builds` | `/advanced/builds` | `/deploy/how-deploys-work` (merge) or keep hidden | Low — niche content |
| `mcp` | `/mcp` | Could become `/developer/mcp` or `/integrations/mcp` | Low — single page |

### 2C. LOCALE INCONSISTENCIES

| Issue | Details |
|---|---|
| ja-JP / zh-CN / es-ES still use old structure | Old `_meta.ts` modified but old filenames still present. These locales need their own migration pass. |
| zh-CN has exclusive `/networking/pre-icp-subdomain` | Needs to be migrated to `/infrastructure/pre-icp-subdomain` when zh-CN is updated |
| en-US has duplicate old/new files in `legal/` | `terms.mdx` + `terms-of-service.mdx`, `privacy.mdx` + `privacy-policy.mdx`, `fair-use-guideline.mdx` + `fair-use-guidelines.mdx`. Old files should be deleted after redirects are in place |
| en-US has duplicate old/new files in `pricing/` | `plans.mdx`, `pricing.mdx`, `redeem.mdx`, `subscription.mdx` coexist with new files. Old files accessible by URL but not in sidebar |

---

## 3. Redirect Rules — ALREADY IMPLEMENTED ✅

All 76 redirect rules are already in `next.config.js`. No further action needed.

The rules cover:
- **Deleted file renames** (deploy, developer, legal): 12 rules
- **Old hidden dirs → new canonical paths** (data-management, networking, manage, billing, community): 44 rules
- **billing-legal flatten** (pricing, rewards, legal): 12 rules
- **infrastructure/dedicated-server → root**: 2 rules
- **Existing chain fixes** (special-variables, domain-binding, etc.): 8 rules updated in-place

> **Note**: Raycast/VS Code extension pages were restored from git — no redirect needed (files exist on disk).

---

## 4. Staged Deployment Plan

### Stage 0: Pre-flight ✅ COMPLETED
- [x] Fix content gap **G3**: Created `en-US/rewards/` directory with `_meta.ts` + 4 .mdx files
- [x] Fix content gap **G1/G2**: Verified Raycast/VS Code extensions are active, restored files from git
- [x] Fix content gap **G4**: Added redirect `/community/forum` → `/get-started/faq-support`
- [x] All 76 redirect rules implemented in `next.config.js`
- [x] All 8 existing redirect chain destinations updated
- [ ] Validate all new pages render in local preview (no 404s, no compile errors)
- [ ] Verify every `.mdx` file is accounted for in a `_meta.ts`

### Stage 1: Deploy everything (zh-TW/en-US)
**What**: Deploy all changes in a single commit — redirects, new content, structure changes, CSS, theme.config.js i18n. Since redirects and content ship together, there's no window where deleted files 404.

**Rollback**: `git revert` the merge commit.

- [ ] Final local preview validation
- [ ] Commit all changes
- [ ] Deploy
- [ ] Verify checklist:
  - [ ] Homepage `/docs/zh-TW` renders with new sidebar
  - [ ] Homepage `/docs/en-US` renders with new sidebar
  - [ ] All 3 separator sections visible in sidebar (部署與服務, 開發者, 帳務)
  - [ ] Active link shows brand purple color
  - [ ] TOC shows translated labels (目錄, 回到頂部, etc.)
  - [ ] Search placeholder shows translated text
  - [ ] `/deploy/variables` redirects to `/deploy/environment-variables`
  - [ ] `/community/referral` redirects to `/rewards/referral`
  - [ ] `/data-management/volumes` redirects to `/infrastructure/volumes`
  - [ ] `/billing/pricing` redirects to `/pricing/pricing-plans`
  - [ ] ja-JP / zh-CN / es-ES pages still render normally (untouched)
  - [ ] No broken images or 404 console errors on major pages

### Stage 2: Cleanup old files (deferred, after 2-week soak)
**What**: Delete old hidden-directory files that are now fully superseded by new content + redirects. Delete duplicate old/new files in en-US legal/ and pricing/.

**Why deferred**: Gives time for search engines to pick up redirects, for external links to update, and for any issues to surface.

**Rollback**: `git revert`.

- [ ] Delete old files:
  - `data-management/` (all 5 locales) — 5 files per locale
  - `networking/` (all 5 locales) — 3 files per locale (+1 zh-CN)
  - `manage/` (all 5 locales) — 4 files per locale
  - `billing/` (all 5 locales) — 4-5 files per locale
  - `community/` (all 5 locales) — 5 files per locale
  - `en-US/legal/` old files: terms.mdx, privacy.mdx, fair-use-guideline.mdx
  - `en-US/pricing/` old files: plans.mdx, pricing.mdx, redeem.mdx, subscription.mdx
- [ ] Deploy
- [ ] Verify redirects catch all deleted paths

### Stage 3: Other locales (ja-JP, zh-CN, es-ES)
**What**: Apply the same file renames/moves to ja-JP, zh-CN, es-ES. Create new sections (infrastructure/, operations/, pricing/, rewards/, legal/) in those locales.

**Scope**: ~60 files per locale × 3 locales = ~180 file operations.

**Rollback**: Per-locale revert.

- [ ] ja-JP migration
- [ ] zh-CN migration (include pre-icp-subdomain → infrastructure/)
- [ ] es-ES migration
- [ ] Update those locales' `_meta.ts` to match zh-TW/en-US structure

---

## 5. File Change Summary (zh-TW + en-US)

### 5A. Deleted files (exist in git HEAD, deleted in working tree)

**Both zh-TW and en-US:**
```
D deploy/customize-prebuilt.mdx        → replaced by deploy/custom-docker-image.mdx
D deploy/deploy-in-cli.mdx             → replaced by developer/cli.mdx
D deploy/deploy-with-raycast-extension.mdx  → ✅ RESTORED from git (active product)
D deploy/deploy-with-vscode-extension.mdx   → ✅ RESTORED from git (active product)
D deploy/github.mdx                    → replaced by deploy/github-integration.mdx
D deploy/variables.mdx                 → replaced by deploy/environment-variables.mdx
D developer/use-api-key.mdx            → replaced by developer/api-keys.mdx
D get-started.mdx                      → replaced by get-started/ folder
D ai-hub.mdx                           → replaced by ai-hub/index.mdx
D dedicated-server.mdx                 → replaced by dedicated-server/index.mdx
```

**zh-TW only:**
```
D legal/fair-use-guideline.mdx         → replaced by legal/fair-use-guidelines.mdx
D legal/privacy.mdx                    → replaced by legal/privacy-policy.mdx
D legal/terms.mdx                      → replaced by legal/terms-of-service.mdx
```

### 5B. New files (untracked)

**Both zh-TW and en-US:**
```
?? ai-hub/index.mdx
?? billing-legal/                      (transitional index)
?? dedicated-server/index.mdx
?? deploy/custom-docker-image.mdx
?? deploy/environment-variables.mdx
?? deploy/github-integration.mdx
?? deploy/how-deploys-work.mdx
?? deploy/index.mdx                    (rewritten landing page)
?? deploy/templates/                   (template-catalog + fork-from-template)
?? developer/api-keys.mdx
?? developer/cli.mdx
?? developer/index.mdx
?? get-started/                        (platform-overview, quick-start, start-by-need, best-practices, migration/, faq-support/)
?? infrastructure/                     (9 files: index + 8 topics)
?? legal/_meta.ts
?? legal/fair-use-guidelines.mdx
?? legal/privacy-policy.mdx
?? legal/terms-of-service.mdx
?? mesh/
?? operations/                         (12 files: index + 11 topics)
?? pricing/                            (2 files: pricing-plans, subscription-billing)
?? template/index.mdx
```

**zh-TW only:**
```
?? ia-overview.mdx
?? migration-script.mdx
?? rewards/                            (4 files: redeem-card, referral, reward, sponsor)
```

**en-US (created):**
```
?? rewards/                            ✅ CREATED (_meta.ts + redeem-card, referral, reward, sponsor)
```

### 5C. Modified files

```
M _meta.ts (root — both locales)
M deploy/_meta.ts (both)
M deploy/create-project.mdx (both)
M deploy/deploy-button.mdx (both)
M deploy/export-project.mdx (both)
M developer/_meta.ts (both)
M developer/public-api.mdx (both)
M developer/websocket-guide.mdx (both)
M ai-hub/_meta.ts (both)
M dedicated-server/_meta.ts (both)
M template/_meta.ts (both)
M styles.css
M theme.config.js
M next.config.js
M _document.js
M index.mdx (zh-TW only)
M legal/privacy.mdx (en-US only — modified, not deleted)
M _meta.ts (ja-JP, zh-CN, es-ES — root only, sidebar label changes)
```

---

## 6. Validation Checklist

After full deployment, verify every section:

### Sidebar sections (zh-TW) — 3 separator sections
- [ ] 部署與服務: 8 items (專用伺服器, 基礎設施, 部署, 維運, 模板, AI Hub, Email, 整合)
- [ ] 開發者: 2 items (開發者工具, 語言與框架)
- [ ] 帳務: 3 items (定價與訂閱, 推薦與獎勵, 法律與合規)
- [ ] 入門 (top-level folder, no separator): 平台概覽, 快速入門, 依需求開始, 最佳實踐, 遷移, 常見問答

### Redirect spot-checks
- [ ] `/docs/zh-TW/deploy/variables` → 301 → `/docs/zh-TW/deploy/environment-variables`
- [ ] `/docs/en-US/developer/use-api-key` → 301 → `/docs/en-US/developer/api-keys`
- [ ] `/docs/zh-TW/billing/pricing` → 301 → `/docs/zh-TW/pricing/pricing-plans`
- [ ] `/docs/en-US/community/referral` → 301 → `/docs/en-US/rewards/referral`
- [ ] `/docs/zh-TW/data-management/volumes` → 301 → `/docs/zh-TW/infrastructure/volumes`
- [ ] `/docs/en-US/manage/invite` → 301 → `/docs/en-US/operations/invite-member`
- [ ] `/docs/zh-TW/legal/terms` → 301 → `/docs/zh-TW/legal/terms-of-service`
- [ ] `/docs/ja-JP/deploy/variables` → 200 (old file still exists in ja-JP)

### Visual checks
- [ ] Sidebar active link = brand purple (#6300FF light / #a370ff dark)
- [ ] Sidebar text color = 75% opacity black/white (not gray)
- [ ] Section separators = uppercase, 0.65rem, muted gray
- [ ] TOC title = 「目錄」(zh-TW) / "On This Page" (en-US)
- [ ] Search placeholder = 「搜尋文件…」(zh-TW) / "Search documentation…" (en-US)

### Other locales (should be unaffected)
- [ ] `/docs/ja-JP` renders normally with old sidebar structure
- [ ] `/docs/zh-CN` renders normally with old sidebar structure
- [ ] `/docs/es-ES` renders normally with old sidebar structure
