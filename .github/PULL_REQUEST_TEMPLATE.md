<!--
此 PR template 是 zeabur/zeabur 的預設範本。
若 PR 內容**未涉及 docs/**，可刪除下方「📚 Docs PRs」區塊後再送出。
-->

## Summary

<!-- 一句話描述這個 PR 做了什麼。 -->

## Test plan

- [ ] <!-- 列出驗證步驟 -->

---

<details open>
<summary><b>📚 Docs PRs（如果這個 PR 修改 <code>docs/</code>，必填）</b></summary>

> 文件分類錯誤會連動影響 AI Agent 索引、in-app CTA URL、與使用者搜尋直覺。
> 完整規則見 [zebra-manual / docs-maintenance](https://github.com/zeabur/zebra-manual/tree/main/docs/docs-maintenance)。

### 分類流程（新增 / 搬移文件必跑）

- [ ] 已用 [`classification-guide.md` §1 決策樹](https://github.com/zeabur/zebra-manual/blob/main/docs/docs-maintenance/classification-guide.md#1-分類決策樹) 確認文件落點
- [ ] 文件歸屬於**單一** Diátaxis 象限（Tutorial / How-to / Reference / Explanation）
- [ ] 確認**沒有**新增 L1 目錄；如果有，已在下方說明理由並 tag Docs Owner（@linglingwu05）

### 5 語系一致性

- [ ] `.mdx` 同時建立在 `en-US` 與 `zh-TW`
- [ ] **5 個語系**的 `_meta.ts` 都已同步更新（en-US / zh-TW / zh-CN / ja-JP / es-ES）— 即使尚未翻譯，key 必須先建立
- [ ] 圖片放在 `docs/public/{section}/`

### 搬移 / 重新命名（適用時勾選）

- [ ] `next.config.js` 已加 301 redirect（含 `/:locale/` 變體）
- [ ] 舊位置在所有 5 個語系標記 `{ display: 'hidden' }`
- [ ] `grep -rn '舊路徑' docs/pages/ --include='*.mdx'` 已確認無殘留內部連結

### 驗證

- [ ] `cd docs && pnpm dev` — 本地確認側欄位置正確、內容渲染正常
- [ ] `cd docs && bash scripts/audit-docs.sh` — 通過審計（CI 也會自動跑）

### 分類決策說明（如果是新增 / 搬移文件）

<!-- 簡述：為什麼放在這個位置？走完決策樹哪一條路徑？ -->

</details>
