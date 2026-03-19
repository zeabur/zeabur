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
