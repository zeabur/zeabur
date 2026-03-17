export default {
  'get-started': '入門',

  // ── 部署與服務 ────────────────────────────────────────────────────────────
  '--- deploy-service ---': { type: 'separator', title: '部署與服務' },
  'dedicated-server': '專用伺服器',
  infrastructure:     '基礎設施',
  deploy:             '部署',
  operations:         '維運',
  template:           '模板',
  'ai-hub':           'Zeabur AI Hub',
  email:              'Zeabur Email',
  integrations:       '整合',

  // ── 開發者 ──────────────────────────────────────────────────────────────
  '--- developer ---': { type: 'separator', title: '開發者' },
  developer: '開發者工具',
  guides:    '語言與框架',

  // ── 帳務 ────────────────────────────────────────────────────────────────
  '--- billing ---': { type: 'separator', title: '帳務' },
  pricing: '定價與訂閱',
  rewards: '推薦與獎勵',
  legal:   '法律與合規',

  // ── 隱藏：舊版目錄（不顯示在 sidebar）────────────────────────────
  advanced:       { display: 'hidden' },
  billing:        { display: 'hidden' },
  'billing-legal': { display: 'hidden' },
  community:      { display: 'hidden' },
  'data-management': { display: 'hidden' },
  manage:         { display: 'hidden' },
  mesh:           { display: 'hidden' },
  networking:     { display: 'hidden' },
  tutorials:      { display: 'hidden' },
  mcp:            { display: 'hidden' },

  // ── 內部文件（直連可看，不出現在 sidebar）──────────────────────────
  'ia-overview':     { display: 'hidden' },
  'migration-script': { display: 'hidden' },

  // ── Root index — served at /zh-TW, hidden from sidebar ─────────
  index: { display: 'hidden' },
}
