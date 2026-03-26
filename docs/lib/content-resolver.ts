import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { existsSync } from 'node:fs'
import { defaultLocale } from './i18n/locales'
import type { Locale } from './i18n/locales'

const TRANSLATIONS_DIR = join(process.cwd(), 'translations')

/**
 * Check if a translated version exists for a given MDX path and locale.
 * Returns the translated content if available, null otherwise.
 */
export async function getTranslatedContent(
  mdxPath: string[] | undefined,
  locale: Locale
): Promise<string | null> {
  if (locale === defaultLocale) return null

  const pathSegments = mdxPath?.length ? mdxPath.join('/') : 'index'

  // Try .mdx then .md
  for (const ext of ['.mdx', '.md']) {
    const translatedPath = join(TRANSLATIONS_DIR, locale, `${pathSegments}${ext}`)
    if (existsSync(translatedPath)) {
      return readFile(translatedPath, 'utf-8')
    }
  }

  // Also try with /index suffix
  for (const ext of ['.mdx', '.md']) {
    const translatedPath = join(TRANSLATIONS_DIR, locale, pathSegments, `index${ext}`)
    if (existsSync(translatedPath)) {
      return readFile(translatedPath, 'utf-8')
    }
  }

  return null
}
