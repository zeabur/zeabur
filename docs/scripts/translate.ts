import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { join, dirname, relative } from 'node:path'
import { existsSync } from 'node:fs'
import { translateMdx, TARGET_LOCALES } from '../lib/services/translation-service'

const CONTENT_DIR = join(process.cwd(), 'content')
const TRANSLATIONS_DIR = join(process.cwd(), 'translations')
const HASHES_FILE = join(TRANSLATIONS_DIR, '.hashes.json')

interface HashCache {
  [filePath: string]: string
}

function md5(content: string): string {
  return createHash('md5').update(content).digest('hex')
}

async function loadHashes(): Promise<HashCache> {
  try {
    if (existsSync(HASHES_FILE)) {
      const data = await readFile(HASHES_FILE, 'utf-8')
      return JSON.parse(data)
    }
  } catch {
    // Start fresh if cache is corrupted
  }
  return {}
}

async function saveHashes(hashes: HashCache): Promise<void> {
  await mkdir(dirname(HASHES_FILE), { recursive: true })
  await writeFile(HASHES_FILE, JSON.stringify(hashes, null, 2))
}

async function findMdxFiles(dir: string): Promise<string[]> {
  const files: string[] = []

  async function walk(currentDir: string) {
    const entries = await readdir(currentDir, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = join(currentDir, entry.name)
      if (entry.isDirectory()) {
        await walk(fullPath)
      } else if (entry.name.endsWith('.mdx') || entry.name.endsWith('.md')) {
        files.push(fullPath)
      }
    }
  }

  if (existsSync(dir)) {
    await walk(dir)
  }
  return files
}

async function translateFile(
  filePath: string,
  content: string,
  locale: string
): Promise<boolean> {
  const relativePath = relative(CONTENT_DIR, filePath)
  const outputPath = join(TRANSLATIONS_DIR, locale, relativePath)

  try {
    const result = await translateMdx(content, locale)
    if (!result.success) {
      console.error(`  ✗ ${locale}: ${result.error}`)
      return false
    }

    await mkdir(dirname(outputPath), { recursive: true })
    await writeFile(outputPath, result.content)
    console.log(`  ✓ ${locale}`)
    return true
  } catch (error) {
    console.error(`  ✗ ${locale}: ${error}`)
    return false
  }
}

async function main() {
  // Skip translation if no API key is set
  if (!process.env.GOOGLE_GENAI_API_KEY) {
    console.log('⚠ GOOGLE_GENAI_API_KEY not set — skipping translation')
    return
  }

  console.log('🌐 Starting translation pipeline...')

  const mdxFiles = await findMdxFiles(CONTENT_DIR)
  if (mdxFiles.length === 0) {
    console.log('No content files found in content/ — skipping translation')
    return
  }

  const oldHashes = await loadHashes()
  const newHashes: HashCache = {}
  let changedFiles: { path: string; content: string }[] = []

  // Detect changed files
  for (const filePath of mdxFiles) {
    const content = await readFile(filePath, 'utf-8')
    const hash = md5(content)
    const relativePath = relative(CONTENT_DIR, filePath)
    newHashes[relativePath] = hash

    if (oldHashes[relativePath] !== hash) {
      changedFiles.push({ path: filePath, content })
    }
  }

  if (changedFiles.length === 0) {
    console.log('✓ No content changes detected — skipping translation')
    await saveHashes(newHashes)
    return
  }

  console.log(`Found ${changedFiles.length} changed file(s) to translate:`)

  let totalSuccess = 0
  let totalFail = 0

  for (const { path: filePath, content } of changedFiles) {
    const relativePath = relative(CONTENT_DIR, filePath)
    console.log(`\n📄 ${relativePath}`)

    // Translate to all target locales in parallel (with concurrency limit)
    const CONCURRENCY = 5
    for (let i = 0; i < TARGET_LOCALES.length; i += CONCURRENCY) {
      const batch = TARGET_LOCALES.slice(i, i + CONCURRENCY)
      const results = await Promise.all(
        batch.map((locale) => translateFile(filePath, content, locale))
      )
      totalSuccess += results.filter(Boolean).length
      totalFail += results.filter((r) => !r).length
    }
  }

  // Save updated hashes (even if some translations failed — they'll retry next time)
  // Only save hash for files where ALL translations succeeded
  const finalHashes: HashCache = { ...oldHashes }
  for (const { path: filePath } of changedFiles) {
    const relativePath = relative(CONTENT_DIR, filePath)
    // Always update hash — failed translations will be retried when content changes
    // or can be force-retried by clearing .hashes.json
    finalHashes[relativePath] = newHashes[relativePath]
  }
  await saveHashes(finalHashes)

  console.log(`\n✓ Translation complete: ${totalSuccess} succeeded, ${totalFail} failed`)
}

main().catch((error) => {
  console.error('Translation pipeline error:', error)
  // Don't fail the build if translation fails
  process.exit(0)
})
