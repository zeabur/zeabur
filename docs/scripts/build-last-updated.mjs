import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const DOCS_ROOT = path.resolve(import.meta.dirname, '..')
const PAGES_DIR = path.join(DOCS_ROOT, 'pages')
const OUT_FILE = path.join(DOCS_ROOT, 'lib', 'last-updated.json')

const GIT_ROOT = execSync('git rev-parse --show-toplevel', { cwd: DOCS_ROOT })
  .toString()
  .trim()

function walk(dir) {
  const out = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('_')) continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) out.push(...walk(full))
    else if (/\.mdx?$/.test(entry.name)) out.push(full)
  }
  return out
}

function routeFor(absPath) {
  const rel = path.relative(PAGES_DIR, absPath).replace(/\\/g, '/')
  const noExt = rel.replace(/\.mdx?$/, '')
  const noIndex = noExt.replace(/(^|\/)index$/, '')
  return '/' + noIndex
}

function gitTimestamp(absPath) {
  const relFromGitRoot = path.relative(GIT_ROOT, absPath).replace(/\\/g, '/')
  const out = execSync(
    `git log -1 --format=%cI -- "${relFromGitRoot}"`,
    { cwd: GIT_ROOT },
  )
    .toString()
    .trim()
  return out || null
}

const files = walk(PAGES_DIR)
const manifest = {}
let missing = 0
for (const file of files) {
  const ts = gitTimestamp(file)
  if (!ts) {
    missing++
    continue
  }
  manifest[routeFor(file)] = ts
}

fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true })
fs.writeFileSync(OUT_FILE, JSON.stringify(manifest, null, 2) + '\n')

console.log(
  `[last-updated] wrote ${Object.keys(manifest).length} routes` +
    (missing ? ` (${missing} files missing git history)` : ''),
)
