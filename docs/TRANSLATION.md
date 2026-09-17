# Local documentation translation

English pages in `pages/en-US/` are the source of truth. `pnpm translate:local` finds missing Markdown/MDX files in the other locales configured in `i18n-config.js`, translates them through an employee's local Codex or Claude Code login, and saves them under `pages/<locale>/` for review and commit.

This command works with the current Nextra 3 site. It does not require the Nextra 4 migration. It does not update existing translations, generate sidebar/UI dictionaries, add languages to the site, commit, or push.

## Setup

Install dependencies with `pnpm install` in `docs/`. Install a current Codex or Claude Code CLI, then sign in with `codex login` or `claude auth login` using your subscription. The command verifies subscription authentication and rejects API-key authentication. It does not load `.env` files or pass API credentials/provider overrides to the child CLI.

Codex must support `exec --ignore-user-config`, `--output-schema`, and `--output-last-message`. Claude must support `--safe-mode`, `--json-schema`, and `auth status --json`. An unsupported CLI exits with an error rather than falling back to an API service.

Generation consumes your plan allowance. Account-level extra usage settings still apply, so this is not unlimited or guaranteed-free usage. No AI Hub credentials or infrastructure are involved.

## Commands

Run from `docs/`:

```sh
# Preview only: no model calls. Omitting --dry-run also previews.
pnpm translate:local --locales=ja-JP --dry-run

# Generate at most five missing pages through your Codex subscription.
pnpm translate:local --provider=codex --locales=ja-JP --limit=5 --write

# Or use Claude Code.
pnpm translate:local --provider=claude --locales=es-ES --limit=5 --write

# Restrict to one English-relative path.
pnpm translate:local --locales=ja-JP --page=community/help.mdx --write

# Explicitly select every missing page in all configured target locales.
pnpm translate:local --all --write
```

The default provider is Codex; the default selection includes all four target locales and at most ten missing pages. `--all` removes that limit. The preview prints the exact selection. English is never a translation target, and unsupported locale names are rejected.

Each page gets one CLI invocation. The first authentication, quota, timeout or validation failure stops the run without automatic retries. Completed pages remain available for review; repeating the command selects only pages still missing. Existing files, including empty files and symlinks, are preserved. Source changes during generation or a concurrently created target prevent publication.

The model receives prose segments, including supported frontmatter text, with their IDs. Imports, code examples, inline code, component props, link destinations and Markdown/MDX structure remain source-owned. The command validates response completeness and template placeholders, then compiles the reconstructed MDX before publishing it atomically. This checks structure, not translation quality or factual correctness; review the generated language before committing.

Codex runs outside the repository with a read-only sandbox, shell tools disabled and user configuration ignored. Claude runs outside the repository in safe mode with built-in tools and MCP servers disabled; its structured-output mechanism remains available.

Local source/output hashes, the latest run report and a concurrency lock are kept in ignored `.translation-local/`. Generated pages are not ignored. If a process is forcibly killed, confirm it has stopped before removing `.translation-local/.local-translation.lock`.

## Before pushing

```sh
git status --short
# Include new files in your review; git diff alone does not display untracked files.
git diff -- pages
pnpm test:translation
pnpm exec tsc --noEmit
pnpm build
```

Review English facts as well as translated prose, links and rendering. Existing translations may be stale; missing-only generation does not certify their freshness.

Builds, CI and Git hooks never invoke generation automatically. The command rejects `--write` when CI is enabled; previews and fixture-based tests require no model credentials.
