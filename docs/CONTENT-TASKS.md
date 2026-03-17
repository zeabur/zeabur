# Phase 2B：內容撰寫任務腳本

> 本文件由 IA 重構 Phase 2A（結構調整）完成後生成。
> 以下所有頁面的檔案與路由已建立，目前為 WIP placeholder。
> 請在新對話中逐區塊撰寫，每完成一區塊即可 commit + preview 驗證。

## 工作原則

- **語系順序**：先寫 zh-TW，再翻 en-US
- **內容來源**：Notion 規劃頁、zebra-manual、changelog、現有文件
- **WIP Callout**：撰寫完成後移除 `<Callout type="warning">` 佔位區塊
- **交叉連結**：撰寫時注意補上相關頁面的 backlink
- **圖片路徑**：使用 `/docs/public/` 下的原始路徑，不複製檔案

---

## 區塊 1：伺服器（dedicated-server/）

### 1.1 共享叢集（已停止服務）
- **檔案**：`pages/{zh-TW,en-US}/dedicated-server/shared-cluster.mdx`
- **內容要點**：
  - 共享叢集的歷史簡介（什麼時候推出、為何停止）
  - 與專用伺服器的差異
  - 遷移引導：如何從共享叢集遷移到專用伺服器
  - 參考：zebra-manual 伺服器相關文件

### 1.2 防火牆與安全設定
- **檔案**：`pages/{zh-TW,en-US}/dedicated-server/firewall.mdx`
- **內容要點**：
  - 伺服器層級的防火牆規則設定
  - IP 白名單 / 黑名單
  - 安全最佳實踐
  - 參考：changelog 近期防火牆功能更新

---

## 區塊 2：部署（deploy/）

### 2.1 搬遷專案
- **檔案**：`pages/{zh-TW,en-US}/deploy/migrate-project.mdx`
- **內容要點**：
  - 說明搬遷本質 = 複製專案 + 備份同步
  - 跨區域搬遷步驟
  - 跨帳號搬遷步驟
  - 注意事項（DNS、環境變數、資料備份）
  - 交叉連結：[複製專案](/deploy/copy-project)、[備份與還原](/operations/backup-restore)

### 2.2 一鍵部署按鈕 — 補充 Plug-in 關鍵字
- **檔案**：`pages/{zh-TW,en-US}/deploy/deploy-button.mdx`（已存在，編輯即可）
- **內容要點**：
  - 在頁面標題或描述中加入「外掛（Plug-in）」關鍵字
  - 說明 Deploy Button 可作為外掛嵌入各種平台

---

## 區塊 3：模板（template/）

### 3.1 維護與更新模板
- **檔案**：`pages/{zh-TW,en-US}/template/maintain-template.mdx`
- **內容要點**：
  - 模板版本更新流程
  - 模板審核標準
  - 維護者獎勵機制 — backlink 到 [貢獻獎勵](/rewards/reward)
  - 參考：changelog 模板相關更新

---

## 區塊 4：AI Hub

### 4.1 AI Hub 模型列表 backlink
- **檔案**：`pages/{zh-TW,en-US}/ai-hub/index.mdx`（已存在，編輯即可）
- **內容要點**：
  - 在頁面中新增各模型的 backlink 到官方模型頁面
  - 補充模型列表與可用性說明

---

## 區塊 5：定價（pricing/）

### 5.1 Free Plan
- **檔案**：`pages/{zh-TW,en-US}/pricing/free-plan.mdx`
- **內容要點**：
  - 免費方案包含的資源（CPU/RAM/流量/儲存限制）
  - 限制與注意事項
  - 升級路徑
  - 參考：Notion 2026Q2 定價規劃 https://www.notion.so/zeabur/2026Q2-22ca221c948e80a98df8deef2eae3556

### 5.2 Dev Plan
- **檔案**：`pages/{zh-TW,en-US}/pricing/dev-plan.mdx`
- **內容要點**：
  - 開發者方案的資源配額
  - 與 Free 的差異
  - 適用場景

### 5.3 Team Plan
- **檔案**：`pages/{zh-TW,en-US}/pricing/team-plan.mdx`
- **內容要點**：
  - 團隊方案的資源配額與 seat 機制
  - 發票與統編支援
  - 與 Dev 的差異
  - 適用場景

---

## 區塊 6：訂閱與帳單（subscription/）

### 6.1 付款方式
- **檔案**：`pages/{zh-TW,en-US}/subscription/payment-methods.mdx`
- **內容要點**：
  - 支援的付款方式（信用卡、Alipay 等）
  - 付款流程
  - 常見問題

### 6.2 免費額度說明
- **檔案**：`pages/{zh-TW,en-US}/subscription/free-quota.mdx`
- **內容要點**：
  - 免費額度的計算方式
  - 適用範圍（不含專用伺服器費用等）
  - 額度用盡後的處理方式

### 6.3 退款政策
- **檔案**：`pages/{zh-TW,en-US}/subscription/refund-policy.mdx`
- **內容要點**：
  - 退款條件與流程
  - 取消訂閱的處理方式
  - 聯繫方式

### 6.4 發票與統編
- **檔案**：`pages/{zh-TW,en-US}/subscription/invoicing.mdx`
- **內容要點**：
  - 如何申請發票
  - 統一編號設定
  - 支援的國家/地區
  - Team Plan 以上才支援的功能說明

---

## 區塊 7：合作夥伴計畫（partner/）

### 7.1 教育推廣
- **檔案**：`pages/{zh-TW,en-US}/partner/education.mdx`
- **內容要點**：
  - 講師/活動主辦合作模式
  - Event code 機制說明
  - 獎勵計算方式（留存付費用戶 $5/人）
  - 申請方式
  - 參考：Notion Partner Program https://www.notion.so/zeabur/2efa221c948e80598043e5ce84d24824

### 7.2 導入顧問（Sales Partner）
- **檔案**：`pages/{zh-TW,en-US}/partner/sales-partner.mdx`
- **內容要點**：
  - 觸發條件：單筆 > $1,000 或機構統一採購
  - 返現計算：合約總額 ÷ 合約月數
  - 與推薦碼的區隔（同一筆交易只走一條路）
  - 申請與合約流程
  - 參考：Notion Partnership Scheme https://www.notion.so/zeabur/302a221c948e806ba113e57075c0125b

### 7.3 合作夥伴計畫首頁（index）
- **檔案**：`pages/{zh-TW,en-US}/partner/index.mdx`
- **內容要點**：
  - Partner Program 總覽
  - 兩種合作模式簡介
  - 與推薦計畫的關係與區隔
  - CTA：申請連結

---

## 備忘

- 推薦計畫（rewards/referral.mdx）需更新為新制 5 級 Tier，但這屬於 Rewards 區塊的獨立任務，不在此腳本範圍
- 現有 pricing/pricing-plans.mdx（方案總覽）已有內容，檢查是否需要配合新子頁更新
- subscription/index.mdx 內容來自原 pricing/subscription-billing.mdx，檢查是否需要重構
