import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const DOCS_ROOT = path.resolve(import.meta.dirname, '..')
const PAGES_DIR = path.join(DOCS_ROOT, 'pages')
const OUT_FILE = path.join(DOCS_ROOT, 'lib', 'last-updated.json')

const GIT_ROOT = execFileSync('git', ['rev-parse', '--show-toplevel'], {
  cwd: DOCS_ROOT,
  encoding: 'utf8',
}).trim()

const IS_SHALLOW =
  execFileSync('git', ['rev-parse', '--is-shallow-repository'], {
    cwd: GIT_ROOT,
    encoding: 'utf8',
  }).trim() === 'true'

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
  const out = execFileSync(
    'git',
    ['log', '-1', '--format=%cI', '--', relFromGitRoot],
    { cwd: GIT_ROOT, encoding: 'utf8' },
  ).trim()
  return out || null
}

function readCommittedManifest() {
  try {
    return JSON.parse(fs.readFileSync(OUT_FILE, 'utf8'))
  } catch {
    return {}
  }
}

const files = walk(PAGES_DIR)
const expectedRoutes = files.map(routeFor)

// Shallow clones (e.g. Zeabur/Vercel build containers) can't see history for
// most files, so `git log` returns empty and we'd overwrite the committed
// manifest with garbage. Bail out and let the committed copy be used as-is —
// but first, verify every current MDX route is covered by the committed
// manifest. Otherwise a new page added without regenerating the manifest
// would silently ship without a "Last updated" line.
if (IS_SHALLOW) {
  const committed = readCommittedManifest()
  const missingRoutes = expectedRoutes.filter((route) => !committed[route])
  if (missingRoutes.length) {
    const msg =
      `[last-updated] committed manifest missing ${missingRoutes.length} routes:\n` +
      missingRoutes.map((r) => `  - ${r}`).join('\n')
    if (process.env.CI) {
      throw new Error(
        msg + '\nRun `pnpm predev` locally and commit lib/last-updated.json.',
      )
    }
    console.warn(msg)
  }
  console.log(
    '[last-updated] shallow clone detected — skipping regeneration; using committed manifest',
  )
  process.exit(0)
}

const manifest = {}
const missingFiles = []
for (const file of files) {
  const ts = gitTimestamp(file)
  if (!ts) {
    missingFiles.push(path.relative(PAGES_DIR, file).replace(/\\/g, '/'))
    continue
  }
  manifest[routeFor(file)] = ts
}

fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true })
fs.writeFileSync(OUT_FILE, JSON.stringify(manifest, null, 2) + '\n')

console.log(
  `[last-updated] wrote ${Object.keys(manifest).length} routes` +
    (missingFiles.length ? ` (${missingFiles.length} files missing git history)` : ''),
)

// Fail the CI build if any tracked MDX file is missing git history — every
// page must render a "Last updated" timestamp. Locally we only warn, since
// uncommitted in-progress files are expected.
if (missingFiles.length && process.env.CI) {
  throw new Error(
    `[last-updated] missing git history for ${missingFiles.length} files:\n` +
      missingFiles.map((f) => `  - ${f}`).join('\n'),
  )
}
