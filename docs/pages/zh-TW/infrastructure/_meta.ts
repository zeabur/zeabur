export default {
  index: { display: 'hidden' },  // section landing — clickable but no extra sidebar link

  // ── 儲存 ─────────────────────────────────────────────────────────────────
  '--- storage ---': { type: 'separator', title: '儲存' },
  volumes:                  '持久儲存空間',
  'file-management':        '檔案管理',
  'backup-restore':         '備份與還原',
  'config-file-management': '設定檔管理',

  // ── 網路 ─────────────────────────────────────────────────────────────────
  '--- networking ---': { type: 'separator', title: '網路' },
  'public-networking':  '公共網路',
  'private-networking': '私有網路',
  'high-availability':  '高可用性架構',
  'edge-caching':       '邊緣快取 / CDN',
}
