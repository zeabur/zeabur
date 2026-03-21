# Zeabur Docs — 設計系統約束

修改 docs 樣式時必須遵循以下規範，不可隨意覆蓋。

## Font Loading
- 字型透過 `next/font/google` 在 `docs/lib/fonts.ts` 定義（Geist + Noto Sans TC/SC/JP + JetBrains Mono）
- SSR 掛載在 `_document.js` 的 `<html className>`，Client 端在 `_app.tsx` 引入防 tree-shaking
- `<html>` 不硬寫 `lang`，由 `_app.tsx` useEffect 動態設定（不影響 Nextra locale middleware）

## 色彩 Token（3-tier warm gray）
- `--zb-text` = 標題（light: `#1f1f1f`, dark: `#ededec`）
- `--zb-text-2` = 本文（light: `#37352f`, dark: `#d4d4d2`）
- `--zb-text-muted` = 輔助（light: `#787774`, dark: `#9b9a97`）
- `--zb-purple` = 品牌紫（accent, active link, hover）
- `--zb-orange` = 內容強調（inline code, blockquote）

## Type Scale
- Latin base: 15px, CJK base: 14.4px（~97%，因 CJK 視覺偏大 5-8%）
- CJK line-height 比 Latin 多 ~5-8%（筆畫密度需更多呼吸空間）
- 所有字級透過 `--zb-fs-*` + `--zb-lh-*` CSS variables，搭配 `:lang()` selector 切換

## Layout
- `main { padding-top: 1rem }` — 確保 sidebar / content / TOC 頂部對齊
- **禁止**把 main padding-top 調回大數值（會破壞三欄對齊）

## CSS 規則
- 統一在 `docs/pages/styles.css` 管理，不用行內 style
- 需要 `!important` 覆蓋 Nextra/Tailwind 預設
- 使用 `@import layer(nextra-base)` 控制 cascade

## Prev/Next Navigation
- Vercel 風格：上方小標（Previous/Next）+ 下方頁面標題
- 多語系：zh → 上一篇/下一篇，ja → 前へ/次へ，es → Anterior/Siguiente
- CSS `::before` pseudo-element 實作，不改 Nextra 組件

## 完整設計規格
詳見 memory: `docs_design_system.md`

# Locale Structure

- Docs exist in 5 locales: `en-US`, `zh-TW`, `zh-CN`, `ja-JP`, `es-ES` (under `pages/<locale>/`)
- All locales share identical MDX structure — component/prop changes must be applied to all locales

## Available MDX Custom Components

### `<WorkingInProgress />`

- **Source**: `components/WorkingInProgress/index.tsx`
- Displays a locale-aware "work in progress" notice
- Supports: en-US, zh-TW, zh-CN, ja-JP

### `<CreateProject />`

- **Source**: `components/CreateProject/index.tsx`
- Renders locale-aware project creation instructions
- Supports: en-US, zh-CN, zh-TW, ja-JP

### `<LastUpdated />`

- **Source**: `components/LastUpdated/index.tsx`
- Displays formatted "Last updated" timestamp (used automatically by Nextra as `gitTimestamp`)

## Nextra Built-in Components (import from `nextra/components`)

### `<Callout>`

```jsx
import { Callout } from 'nextra/components'

<Callout type="info">Info message</Callout>
```

- **Types**: `"default"` | `"info"` | `"warning"` | `"error"` | `"success"`
- **Optional prop**: `emoji="ℹ️"` for custom emoji

### `<Tabs>` / `<Tabs.Tab>`

```jsx
import { Tabs } from 'nextra/components'

<Tabs items={['pnpm', 'npm', 'yarn']}>
  <Tabs.Tab>pnpm content</Tabs.Tab>
  <Tabs.Tab>npm content</Tabs.Tab>
  <Tabs.Tab>yarn content</Tabs.Tab>
</Tabs>
```

- **Tab sync**: Use `storageKey` prop to sync selection across multiple `<Tabs>` on the same page. Namespace the key to avoid collisions with other pages (e.g., `<Tabs storageKey="wonder-mesh-os" items={['Linux', 'macOS']}>`)

### `<Steps>`

```jsx
import { Steps } from 'nextra/components'

<Steps>
### Step 1
Description
### Step 2
Description
</Steps>
```

## Code Block Enhancements (Nextra syntax)

- **Filename**: ` ```js filename="server.js" ` — shows filename header
- **Copy button**: ` ```bash copy ` — adds copy-to-clipboard button
- **Line highlighting**: ` ```ts {2} ` or ` ```ts {7-8} ` — highlights specific lines
- **Combined**: ` ```json filename="package.json" {3} copy `
