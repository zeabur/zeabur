import {
  readFile,
  mkdir,
  writeFile,
  link,
  unlink,
  lstat,
} from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { randomUUID } from 'node:crypto'
import { contentFiles } from './site-content'
import { extractSegments, applySegments, digest } from './translation-integrity'
import { compileContent } from './compile-content'
import { isValidLocale } from './translation-locales'

export type Provider = 'codex' | 'claude'
export interface LocalJob {
  key: string
  locale: string
  sourcePath: string
  sourceVersion: string
  source: string
  output: string
  labels: Record<string, string>
}
export async function planMissing(
  root: string,
  locales: string[],
): Promise<LocalJob[]> {
  if (locales.some((l) => !isValidLocale(l) || l === 'en-US'))
    throw new Error('Choose valid target locales, not English')
  const files = await contentFiles(join(root, 'pages/en-US'))
  const jobs: LocalJob[] = []
  async function add(locale: string, file: string, output: string) {
    // Even empty files and symlinks belong to the employee: missing-only never replaces them.
    try {
      await lstat(output)
      return
    } catch (e) {
      if ((e as NodeJS.ErrnoException).code !== 'ENOENT') throw e
    }
    const raw = await readFile(file, 'utf8')
    const source = raw
    jobs.push({
      key: output.slice(join(root, 'pages').length + 1),
      locale,
      sourcePath: file,
      sourceVersion: digest(raw),
      source,
      output,
      labels: Object.fromEntries(
        extractSegments(raw).map((s, i) => [String(i), s.text]),
      ),
    })
  }
  for (const locale of Array.from(new Set(locales))) {
    for (const file of files) {
      if (/\.mdx?$/.test(file))
        await add(
          locale,
          join(root, 'pages/en-US', file),
          join(root, 'pages', locale, file),
        )
    }
  }
  return jobs
}
function validateLabels(
  labels: Record<string, string>,
  values: Record<string, string>,
) {
  if (
    !values ||
    Object.keys(values).length !== Object.keys(labels).length ||
    Object.keys(labels).some(
      (k) => typeof values[k] !== 'string' || !values[k].trim(),
    )
  )
    throw new Error('Incomplete translation output')
  for (const [k, source] of Object.entries(labels)) {
    const placeholders = (value: string) =>
      (value.match(/\{\{[^}]+\}\}/g) || []).sort().join('|')
    if (placeholders(source) !== placeholders(values[k]))
      throw new Error(`Translation changed placeholders: ${k}`)
  }
}
export async function saveTranslation(
  job: LocalJob,
  values: Record<string, string>,
) {
  validateLabels(job.labels, values)
  const output = applySegments(job.source, extractSegments(job.source), values)
  await compileContent(output, job.sourcePath)
  if (digest(await readFile(job.sourcePath, 'utf8')) !== job.sourceVersion)
    throw new Error(
      'English source changed during translation; rerun with the new source',
    )
  await mkdir(dirname(job.output), { recursive: true })
  const temporary = job.output + '.' + randomUUID() + '.tmp'
  try {
    await writeFile(temporary, output, { flag: 'wx' })
    await link(temporary, job.output) // Atomic publication; EEXIST preserves concurrent human edits.
  } finally {
    await unlink(temporary).catch(() => {})
  }
  return { source: digest(job.source), output: digest(output) }
}
export function cliEnvironment(
  env: Record<string, string | undefined> = process.env,
): NodeJS.ProcessEnv {
  // Keep native login storage and executable discovery, never API/provider overrides or .env files.
  return {
    NODE_ENV: 'production',
    ...Object.fromEntries(
      [
        'HOME',
        'USER',
        'LOGNAME',
        'USERPROFILE',
        'PATH',
        'TMPDIR',
        'TEMP',
        'TMP',
        'SystemRoot',
        'LANG',
        'LC_ALL',
        'TERM',
        'CODEX_HOME',
        'CLAUDE_CONFIG_DIR',
      ].flatMap((k) => (env[k] === undefined ? [] : [[k, env[k]]])),
    ),
  }
}
export function parseCliResult(
  provider: Provider,
  raw: string,
  labels: Record<string, string>,
): Record<string, string> {
  const parsed = JSON.parse(raw)
  const envelope =
    provider === 'claude' && Array.isArray(parsed)
      ? parsed.findLast((event) => event.type === 'result')
      : parsed
  if (!envelope) throw new Error('Incomplete structured translation output')
  if (
    provider === 'claude' &&
    (envelope.is_error || (envelope.subtype !== 'success' && envelope.subtype))
  )
    throw new Error('Claude CLI failed; check subscription quota and login')
  const payload = provider === 'claude' ? envelope.structured_output : envelope
  if (!Array.isArray(payload?.translations))
    throw new Error('Incomplete structured translation output')
  const result: Record<string, string> = {}
  for (const entry of payload.translations) {
    if (
      typeof entry.id !== 'string' ||
      Object.hasOwn(result, entry.id) ||
      !Object.hasOwn(labels, entry.id)
    )
      throw new Error('Unexpected or duplicate translation key')
    result[entry.id] = entry.text
  }
  validateLabels(labels, result)
  return result
}
