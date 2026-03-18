---
name: i18n-lookup
description: Look up Zeabur platform UI term translations from the dashboard i18n files. Use when writing or reviewing docs that reference UI elements (button labels, tab names, menu items) to ensure docs match the actual platform translations.
argument-hint: <english-term-or-key> [locale]
allowed-tools: Bash, Read, Glob, Grep
---

# Dashboard i18n Lookup

Look up the official translation of a Zeabur platform UI term from the dashboard's i18n source files. This ensures documentation uses the exact same wording users see in the Zeabur dashboard.

## Dashboard i18n Location

The dashboard i18n files are located relative to this docs project at:

```
../../dashboard/public/assets/locales/{locale}/
```

Resolved from the docs project root, this is a sibling `dashboard` repository.

### Available Locales

| Locale | Language |
|--------|----------|
| `en-US` | English (source) |
| `zh-TW` | Traditional Chinese |
| `zh-CN` | Simplified Chinese |
| `ja-JP` | Japanese |
| `es-ES` | Spanish |
| `id-ID` | Indonesian |

### File Structure

Each locale directory contains multiple JSON files organized by feature area:

- `common.json` — shared UI terms (buttons, navigation, project selector, region selector)
- `service.json` — service page UI (tabs like Networking, settings, deployments)
- `servers.json` — server management UI (install commands, server status)
- `project.json` / `projects.json` — project-level UI
- `deploy.json` / `deploy-template.json` — deployment UI
- `settings.json` — settings page
- `header.json` — header/navigation
- And others (`account.json`, `checkout.json`, `modals.json`, etc.)

The JSON files use nested keys with i18next-style interpolation (`{{variable}}`).

## Instructions

### Step 1: Verify Dashboard i18n Availability

Check if the dashboard locales directory exists:

```bash
ls ../../dashboard/public/assets/locales/en-US/ 2>/dev/null
```

**If the directory does not exist**: Print the following message and stop:

> Dashboard i18n files not found at `../../dashboard/public/assets/locales/`. Falling back to manual translation. Please translate UI terms based on context, the glossary at `.claude/skills/translate/glossary.json`, and common Zeabur terminology conventions.

Do NOT error out or block the user's workflow.

### Step 2: Parse Arguments

Parse `$ARGUMENTS` into:

- **search term**: The English UI text or i18n key to look up (e.g. `"Networking"`, `"Create New Project"`, `"region-selector.select-region"`)
- **locale filter** (optional): If a second argument matches a known locale, only show that locale's translation

### Step 3: Search for the Term

1. **If the search term looks like a dotted key** (e.g. `service.networking.title`):
   - Split into `<file>.<nested.key>` and look up directly in the appropriate JSON file

2. **If the search term is plain English text** (e.g. `"Networking"`, `"Create New Project"`):
   - Search across all `en-US/*.json` files for values matching the term (case-insensitive)
   - Use `grep -ri` to find occurrences
   - Once found, note the file and JSON key path

### Step 4: Retrieve Translations

For each match found in `en-US`:

1. Read the same JSON file in each target locale (or only the filtered locale)
2. Navigate to the same key path
3. Collect all translations

### Step 5: Output Results

Print a formatted table:

```
Term: "Create New Project"
Source: common.json → project-selector.create-new-project

| Locale | Translation |
|--------|-------------|
| en-US  | Create New Project |
| zh-TW  | 建立新專案 |
| zh-CN  | 创建新项目 |
| ja-JP  | 新しいプロジェクトを作成 |
| es-ES  | Crear nuevo proyecto |
```

If multiple matches are found, list all of them with their file paths and keys so the user can pick the correct one.

### Common UI Terms Reference

When writing Wonder Mesh or server-related docs, the most relevant i18n files are:

- **`common.json`** — "Create New Project", region/server selector labels
- **`servers.json`** — "Install K3s", "View Install Command", server status terms
- **`service.json`** — "Networking" tab, service page UI elements
- **`project.json`** — project-level actions and labels

### Tips

- If a term is not found in the i18n files, it may be hardcoded in the dashboard source code rather than in the i18n system. In that case, note this and suggest checking the dashboard source.
- Some terms may appear in multiple files with slightly different translations depending on context. List all occurrences so the user can choose the contextually appropriate one.
