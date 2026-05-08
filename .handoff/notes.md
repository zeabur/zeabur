# Handoff: mkt-2296-pr747-pending-redirect-audit

**Parent branch:** mkt-2296-followup (this is also the working branch — no fork)
**Last handoff:** 2026-05-08T03:00+0000

## Current status

PR #747 (MKT-2296) is APPROVED + MERGEABLE at head `3609767f`. Six commits in flight on `mkt-2296-followup` (the same branch we're working on — no separate handoff branch needed since the branch IS the in-progress work).

User found two more pre-existing 404 issues during dogfood:

1. **`/docs/{locale}/marketplace`** → 404 in local + prod. Filed [MKT-2309](https://linear.app/zeabur/issue/MKT-2309) (no fix yet, separate cleanup).
2. **`/docs/zh-TW/operations/maintenance-mode`** → 404 in local + prod. Caused by:
   - `pages/zh-TW/operations/maintenance-mode.mdx` exists (title="暫停服務", stale duplicate of `deployment/suspend-service.mdx`)
   - File is auto-discovered by Nextra → renders sidebar entry `<a href="/docs/zh-TW/operations/maintenance-mode">暫停服務</a>` in the `/operations` page
   - Click → fires the buggy IA redirect `next.config.js:154-155` which sends `/operations/maintenance-mode` → `/operations/deployment/maintenance-mode`
   - Destination doesn't exist → 404 in all 5 locales

When user paused the session, I was running a broader audit script `/tmp/audit-broken-dests.ts` to find ALL redirects in `next.config.js` whose destination .mdx doesn't exist. The script identified 17+ such broken-destination redirects (truncated output — last seen entries listed below). Most of them only show as "404 in: en-US" which is false positive — the audit script's path-resolution logic incorrectly tests every redirect against en-US filesystem when the redirect is locale-prefixed (e.g. `/zh-TW/...`). The audit logic needs fixing before we can act on its results — the maintenance-mode case it surfaced IS real but the mass of "404 in en-US" entries from `/zh-CN/networking/private` etc. are spurious because we're checking for `/en-US/zh-CN/networking/private` which obviously doesn't exist.

## Next steps

1. **Fix `/tmp/audit-broken-dests.ts` locale-handling bug.** When the source already has an explicit `/zh-CN/...` prefix, only check the destination against the matching `zh-CN` filesystem path, not en-US. Current logic always passes `loc="en-US"` to `pathExistsForLocale` for non-`:locale` literal redirects.

2. **Re-run the audit** after the fix and identify the actual broken-destination redirect set. Maintenance-mode is one. Others may exist.

3. **Decide fix approach for maintenance-mode.** Two paths:
   - **A**: delete `pages/zh-TW/operations/maintenance-mode.mdx` (it's a stale duplicate — the same "Suspend Service" content lives at `deployment/suspend-service.mdx`) AND change redirect target to `/operations/deployment/suspend-service`. Cleanest.
   - **B**: just delete the buggy redirect (lines 154-155 of `docs/next.config.js`). Then the file's URL `/operations/maintenance-mode` would serve again at zh-TW. But the file is stale/redundant.
   - Recommend **A** (matches fork-git-repo and chrome-extension fixes already in this PR).

4. **Resolve `/marketplace` (MKT-2309)** — separately or fold into PR747 if scope allows. User's preference unclear; default = leave for separate PR.

5. **Re-verify no regressions** after fixes:
   ```
   bun run scripts/docs-cleanup-verify-rewrites.ts   # 47/47 should still pass
   bun run scripts/docs-cleanup-verify-live.ts        # 238/238 PR745 redirects
   ```

6. **Push and resolve any new bot reviews.** `eee689ad`+`fb55f197`+`3609767f` already addressed all prior bot feedback. New commits will trigger CodeRabbit re-review.

## Related

- **PR**: https://github.com/zeabur/zeabur/pull/747 (mkt-2296-followup → main, head=3609767f, MERGEABLE+APPROVED, UNSTABLE pending CodeRabbit re-scan after `3609767f`)
- **Linear (in flight)**: 
  - [MKT-2296](https://linear.app/zeabur/issue/MKT-2296) — PR747 parent issue
  - [MKT-2308](https://linear.app/zeabur/issue/MKT-2308) — pre-existing 50+ broken relative `../` links (filed earlier, separate PR follow-up)
  - [MKT-2309](https://linear.app/zeabur/issue/MKT-2309) — `/marketplace` bare-path 404
  - [MKT-2268](https://linear.app/zeabur/issue/MKT-2268) — parent (PR745, merged)
- **Dogfood reports**: `dogfood-output/docs-mkt2268/report.md`, `dogfood-output/docs-mkt2296/report.md`
- **zeabur-rag main**: 7 commits ahead of origin (per "no auto push" rule). Includes the apply scripts + recent verify scripts. Push at user discretion.

## Key decisions this session

- **Quick Start sidebar fix (`3609767f`)**: reversed the dir/index sync from `ea0b9513`. en-US prod was clean (`link "Quick Start"`); 4 other locales had pre-existing duplicate (button + nested). My initial sync went the wrong direction. New approach converges all 5 locales to single-file pattern → fixes en-US regression + cleans up 4 pre-existing.
- **Chrome Extension sidebar duplicate (kept as-is)**: `link + nested link` is functional (parent expands menu, child navigates to landing). Production was 404 for the entire path; PR747 trade-off restores the page. Marked as acceptable in dogfood report ISSUE-002.
- **18+12 = 18 review threads all marked resolved** despite some being declined as "out of scope, won't fix" (typo nits). User's directive: "問題處理掉的要標注解決" — interpreted as "address with reasoning, then resolve."
- **Audit script `/tmp/audit-broken-dests.ts` has a known bug** (locale handling per above). Don't trust its output verbatim; fix and re-run.
- **Dev server**: started but not killed when handoff happened. Next session should `lsof -ti :3399 | xargs kill -9` if port is busy, then restart from `data/docs-repo/docs && pnpm next dev -p 3399`.
- **In-memory scripts not yet committed to zeabur-rag main**:
  - `scripts/docs-cleanup-verify-rewrites.ts` (validates this PR's diff)
  - `scripts/docs-cleanup-audit-buggy-redirects.ts` (shadowing redirects audit)
  - These were created during PR747 work. Decide whether to commit on continuation.
