import { readFile, writeFile, mkdir, rename, rm } from 'node:fs/promises'
import { join, relative } from 'node:path'
import { localOptions } from '../lib/local-options'
import { planMissing, saveTranslation } from '../lib/local-translation'
import { verifySubscription, invokeCli } from '../lib/local-cli'
type CacheEntry = { source: string; output: string }

async function main() {
  const options = localOptions(process.argv.slice(2))
  if (options.help) {
    console.log(
      'pnpm translate:local [--provider=codex|claude] [--locales=zh-TW,ja-JP] [--page=guides/dotnet.mdx] [--limit=10|--all] [--dry-run|--write]\nDefault: preview missing files only. --write explicitly launches local subscription CLI sessions. Builds and CI never generate translations.',
    )
    return
  }
  const root = process.cwd()
  const jobs = (await planMissing(root, options.locales)).filter(
    (j) =>
      !options.page ||
      relative(join(root, 'pages/en-US'), j.sourcePath) === options.page,
  )
  const selected = jobs.slice(0, options.limit)
  const counts = Object.fromEntries(
    options.locales.map((locale) => [
      locale,
      jobs.filter((j) => j.locale === locale).length,
    ]),
  )
  console.log(
    JSON.stringify(
      {
        mode: options.write ? 'write' : 'preview',
        provider: options.provider,
        missing: jobs.length,
        selected: selected.length,
        byLocale: counts,
        files: selected.map((j) => j.key),
      },
      null,
      2,
    ),
  )
  if (!options.write || !selected.length) {
    if (!options.write)
      console.log(
        'No CLI calls made. Add --write to generate this selection; use --all for every missing file.',
      )
    return
  }
  const translationDir = join(root, '.translation-local'),
    lock = join(translationDir, '.local-translation.lock')
  await mkdir(translationDir, { recursive: true })
  try {
    await mkdir(lock)
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === 'EEXIST')
      throw new Error(
        'Another local translation run holds .translation-local/.local-translation.lock. If its process was killed, remove that lock directory before resuming.',
      )
    throw e
  }
  const report = {
    provider: options.provider,
    missing: jobs.length,
    selected: selected.length,
    completed: [] as string[],
    failed: [] as { key: string; error: string }[],
    remaining: jobs.length,
  }
  try {
    await verifySubscription(options.provider)
    const cachePath = join(translationDir, '.cache-v2.json')
    let cache: Record<string, CacheEntry> = {}
    try {
      cache = JSON.parse(await readFile(cachePath, 'utf8'))
    } catch (e) {
      if ((e as NodeJS.ErrnoException).code !== 'ENOENT') throw e
    }
    for (const job of selected) {
      console.log(
        `Translating ${job.key} with ${options.provider} (${report.completed.length + 1}/${selected.length})`,
      )
      try {
        const values = await invokeCli(options.provider, job.labels, job.locale)
        cache[job.key] = await saveTranslation(job, values)
        await writeFile(
          cachePath + '.tmp',
          JSON.stringify(cache, null, 2) + '\n',
        )
        await rename(cachePath + '.tmp', cachePath)
        report.completed.push(job.key)
        report.remaining--
      } catch (error) {
        report.failed.push({
          key: job.key,
          error: error instanceof Error ? error.message : String(error),
        })
        process.exitCode = 1
        break // One attempt. Quota or validation failure stops the pass, preserving completed work.
      }
    }
  } finally {
    try {
      await writeFile(
        join(translationDir, '.local-run.json'),
        JSON.stringify(report, null, 2) + '\n',
      )
    } finally {
      await rm(lock, { recursive: true, force: true })
    }
  }
  console.log(JSON.stringify(report, null, 2))
  console.log(
    'Review generated files, then run pnpm test:translation and pnpm build before committing and pushing.',
  )
}
main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error))
  process.exitCode = 1
})
