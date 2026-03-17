export default {
  index: { display: 'hidden' },  // section landing — clickable but no extra sidebar link

  // ── Storage ──────────────────────────────────────────────────────────────
  '--- storage ---': { type: 'separator', title: 'Storage' },
  volumes:                  'Volumes',
  'file-management':        'File Management',
  'backup-restore':         'Backup & Restore',
  'config-file-management': 'Config File Management',

  // ── Networking ───────────────────────────────────────────────────────────
  '--- networking ---': { type: 'separator', title: 'Networking' },
  'public-networking':  'Public Networking',
  'private-networking': 'Private Networking',
  'high-availability':  'High Availability',
  'edge-caching':       'Edge Caching / CDN',
}
