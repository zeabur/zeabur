# Docs IA 重構狀態報告

> 更新時間：2026-03-18
> Branch：`lingwu05/mkt-1554-舊有-all-doc-分類至新架構並實作`
> PR：https://github.com/zeabur/zeabur/pull/681

## 當前 Sidebar 結構（已在 working directory，尚有未 commit 的變更）

```
入門

── (separator 1) ──
伺服器              ← 原「專用伺服器」已改名
部署
網路                ← 從 infrastructure 獨立出來
維運
監控                ← 從 operations 獨立出來
資料管理            ← 從 infrastructure 獨立出來

── (separator 2) ──
AI Hub
Email
模板
整合

── (separator 3) ──
開發者工具
語言與框架

── (separator 4) ──
定價                ← 原「定價與訂閱」拆開
訂閱與帳單          ← 新資料夾
推薦與獎勵
合作夥伴計畫        ← 新資料夾

── (separator 5) ──
隱私權政策          ← 從 legal/ 搬出為獨立頁
合規                ← 新資料夾（fair-use + abuse-report）
服務條款            ← 從 legal/ 搬出為獨立頁
```

> 注意：separator 目前為無標題分隔線 `{ type: 'separator' }`，不顯示文字。
> 使用者反饋此版仍過於冗長，Separator 1 有 6 項、整體 L1 共 19 項，尚需精簡。

## 已完成的結構性變更

| 項目 | 狀態 | 說明 |
|------|------|------|
| 基礎設施解散 | ✅ | 內容分散至 networking/、monitoring/、data-management/ |
| 法律區塊解散 | ✅ | privacy-policy、terms-of-service 獨立，fair-use + abuse 進 compliance/ |
| 訂閱與帳單獨立 | ✅ | subscription/ 新建，含 payment-methods、free-quota、refund-policy、invoicing |
| 合作夥伴計畫 | ✅ | partner/ 新建，含 education、sales-partner |
| 伺服器改名 | ✅ | dedicated-server 顯示名改為「伺服器」，新增 shared-cluster、firewall 頁面 |
| 定價子頁 | ✅ | 新增 free-plan、dev-plan、team-plan |
| 搬遷專案 | ✅ | deploy/migrate-project.mdx 新增 |
| 模板維護 | ✅ | template/maintain-template.mdx 新增 |
| Redirect 規則 | ✅ | next.config.js 含 ~100 條 redirect，覆蓋所有舊→新路徑 |
| 舊目錄隱藏 | ✅ | infrastructure、legal、billing、billing-legal 等均 display: hidden |

## 未完成 / 待決定

| 項目 | 狀態 | 說明 |
|------|------|------|
| Separator 標題 | ❌ | 目前 separator 無標題文字，需確認是否加回 |
| L1 精簡 | ❌ | 使用者認為 19 個 L1 項目太多，需進一步合併或分層 |
| 新頁面內容填寫 | ❌ | 多數新建 .mdx 為 WIP placeholder，需另開串撰寫 |
| Discord → Forum 引導替換 | ❌ | 282 次 Discord 引用跨 172 檔案，需全面替換為 Forum |
| Feedback Widget | ❌ | 頁面底部 submit feedback 元件，需串接 Forum API |
| Git commit | ❌ | 12 個 modified + 10 個 untracked 檔案尚未 commit |
| 部署更新 | ❌ | preview 站 (docs-ia-preview.zeabur.app) 仍為舊版 |

## 檔案變更清單

### Modified（12 檔）
- `docs/next.config.js` — redirect 規則
- `docs/pages/styles.css` — 新區塊樣式
- `docs/pages/{en-US,zh-TW}/_meta.ts` — root sidebar
- `docs/pages/{en-US,zh-TW}/deploy/_meta.ts` — 部署子目錄
- `docs/pages/{en-US,zh-TW}/operations/_meta.ts` — 維運子目錄
- `docs/pages/{en-US,zh-TW}/data-management/_meta.ts` — 資料管理子目錄
- `docs/pages/{en-US,zh-TW}/networking/_meta.ts` — 網路子目錄

### New Untracked（10 檔/目錄）
- `docs/pages/{en-US,zh-TW}/monitoring/` — 監控（整個資料夾）
- `docs/pages/{en-US,zh-TW}/networking/index.mdx` — 網路首頁
- `docs/pages/{en-US,zh-TW}/networking/edge-caching.mdx` — 邊緣快取
- `docs/pages/{en-US,zh-TW}/data-management/index.mdx` — 資料管理首頁

### 新建資料夾（已 committed 於先前 commit）
- `subscription/`、`partner/`、`compliance/`、`pricing/` 子頁、`dedicated-server/` 子頁
