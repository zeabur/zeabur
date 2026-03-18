---
name: translate
description: Translate documentation pages to all missing locales. Use when a document exists in one locale but needs to be translated to others. Supports --dry-run, single-locale targeting, and incremental updates.
argument-hint: <target-path> [locale] [--dry-run]
allowed-tools: Agent, Bash, Read, Write, Edit, Glob, Grep
---

# Translate Documentation

Translate the document at the given target path to locales that are missing or outdated.

## Argument Parsing

Parse `$ARGUMENTS` into these parts:

- **target**: The first positional argument — a document path (e.g. `wonder-mesh`, `billing/plans.mdx`, `en-US/wonder-mesh`)
- **locale filter** (optional): If a second positional argument matches a known locale (`zh-TW`, `zh-CN`, `ja-JP`, `es-ES`), translate to **only** that locale instead of all missing locales
- **--dry-run** flag (optional): If present anywhere in the arguments, only print the detection summary — do NOT write any files

Examples:
- `/translate wonder-mesh` → translate to all missing locales
- `/translate wonder-mesh zh-TW` → translate to zh-TW only
- `/translate wonder-mesh --dry-run` → detection report only
- `/translate wonder-mesh zh-TW --dry-run` → detection report for zh-TW only

## Context

This is a **Nextra-based** documentation site with these locales:
- `en-US` (English — primary/source locale)
- `zh-TW` (Traditional Chinese)
- `zh-CN` (Simplified Chinese)
- `ja-JP` (Japanese)
- `es-ES` (Spanish)

All docs live under `pages/<locale>/`. Each section has a `_meta.ts` file for navigation labels (these must also be translated).

### Glossary

Before translating, read the glossary file at `${CLAUDE_SKILL_DIR}/glossary.json`. This file maps English terms to their approved translations per locale. When translating:
- Terms marked `"keep": true` must remain in English (brand names, technical acronyms)
- Terms with locale-specific values must use the exact translation provided (e.g. "server" → "伺服器" in zh-TW, "服务器" in zh-CN)
- This ensures terminology consistency across the entire documentation site

## Instructions

### Phase 1: Detect Missing & Outdated Translations

1. **Determine the source locale** — identify which locale(s) already have the target. If the target path includes a locale prefix (e.g. `en-US/wonder-mesh`), use that. If it's just a relative path (e.g. `wonder-mesh/get-started.mdx`), search all locales to find the source. Prefer `en-US` as the source if it exists there.

2. **List all files** under the source path. For example, if the target is `wonder-mesh`, list all `.mdx` files and `_meta.ts` files under `pages/<source-locale>/wonder-mesh/`.

3. **Determine target locales** — if a locale filter was provided, only check that locale. Otherwise, check all 4 non-source locales.

4. For each target locale, check which files are **missing or outdated**:
   - **Missing**: The file does not exist at all
   - **Outdated (stub)**: The file exists but is significantly shorter than the source (likely a stub/placeholder)
   - **Outdated (stale)**: The file exists but the source file has been modified more recently. Use `git log -1 --format="%H %ai" -- <file>` to compare the last commit date of the source file vs the translated file. If the source file's last commit is **newer** than the translation's last commit, mark it as stale.

5. **Print a summary table** showing:
   - Each target locale
   - Each file and its status: `missing`, `outdated (stub)`, `outdated (stale)`, or `up-to-date`
   - Total files needing action per locale

6. **If `--dry-run` is set**: Stop here. Print the summary and exit. Do NOT proceed to Phase 2.

7. **If no files need action**: Print "All translations are up to date." and exit.

### Phase 2: Parallel Translation

**Spawn one agent per target locale** that needs translation. All translation agents run in parallel.

Each translation agent must:

1. **Read the glossary** at `${CLAUDE_SKILL_DIR}/glossary.json` and use it throughout translation.
2. **Read the source file(s)** in full.
3. **Read the corresponding `_meta.ts`** in the source locale for navigation labels.
4. **If the file is `outdated (stale)`** (not missing):
   - Read the existing translation file
   - Use `git diff <old-commit>..<new-commit> -- <source-file>` to see what changed in the source
   - Update only the sections that changed, preserving the rest of the existing translation
   - This is more efficient and preserves any manual translation adjustments
5. **If the file is `missing` or `outdated (stub)`**: Translate the full source file.
6. **Translate all content** into the target language:
   - Translate all prose, headings, callouts, and UI text
   - Consult the glossary for all terminology — use the exact translations specified
   - Keep **all MDX imports** unchanged (e.g. `import { Callout } from 'nextra/components'`)
   - Keep **all image paths** unchanged (e.g. `![...](/wonder-mesh/install-script.png)`)
   - Keep **all URLs/links** unchanged unless they are locale-specific documentation links
   - Keep **code blocks** unchanged (only translate comments inside code blocks if they are user-facing)
   - Keep **frontmatter keys** unchanged (`title`, `ogImageTitle`, `ogImageSubtitle`) but translate their **values**
   - For `_meta.ts`: translate the display labels but keep the keys unchanged
   - Preserve the original file structure and formatting exactly
7. **Write the translated files** to the correct locale directory.
8. If the locale's **parent `_meta.ts`** does not have an entry for this section, add it with the translated label (consulting the glossary for the label).

### Translation Quality Guidelines

- Use **natural, idiomatic** phrasing for each language — do not produce literal word-for-word translations
- For `zh-TW`: use Traditional Chinese characters (繁體中文), not Simplified
- For `zh-CN`: use Simplified Chinese characters (简体中文)
- For `ja-JP`: use standard Japanese with appropriate kanji/hiragana/katakana mix
- For `es-ES`: use Castilian Spanish conventions
- Always consult the glossary — terms marked `"keep": true` stay in English, others use the specified translation
- When a term is not in the glossary but is a well-known technical term, keep it in English

### Phase 3: Verification (Main Agent)

After all translation agents complete, the main agent must:

1. **Verify file existence**: Glob for all expected files across all target locales and confirm they exist.
2. **Verify `_meta.ts` consistency**: Read each target locale's `_meta.ts` and confirm the section entry is present with a translated label.
3. **Spot-check content quality**: Read the first 20 lines of each translated file to verify:
   - Frontmatter is properly translated
   - MDX imports are preserved
   - Image paths are unchanged
   - The content is in the correct language
   - Glossary terms are used correctly
4. **Verify structural consistency**: Ensure every target locale has the same number of files for the target section.
5. **Print a final summary**:
   - Number of files created/updated per locale
   - Translation mode used per file (full translation vs incremental update)
   - Any issues found
   - Confirmation that all target locales are complete
