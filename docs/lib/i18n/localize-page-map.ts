import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { existsSync } from 'node:fs'
import type { PageMapItem } from 'nextra'
import { defaultLocale } from './locales'
import type { Locale } from './locales'

const TRANSLATIONS_DIR = join(process.cwd(), 'translations')

/**
 * Load all translated _meta JSON files for a locale.
 * Returns a map of { "sectionKey": "Translated Label" } merged from all meta files.
 */
async function loadTranslatedMeta(locale: Locale): Promise<Record<string, string>> {
  const metaDir = join(TRANSLATIONS_DIR, locale, '_meta')
  if (!existsSync(metaDir)) return {}

  const merged: Record<string, string> = {}
  const { readdir } = await import('node:fs/promises')
  const files = await readdir(metaDir)

  for (const file of files) {
    if (!file.endsWith('.json')) continue
    try {
      const content = await readFile(join(metaDir, file), 'utf-8')
      const labels = JSON.parse(content)
      Object.assign(merged, labels)
    } catch {
      // Skip corrupted files
    }
  }

  return merged
}

/**
 * Recursively remap page map item titles using translated labels.
 */
function remapItem(item: PageMapItem, labels: Record<string, string>): PageMapItem {
  // MdxFile or Folder — has a 'name' property
  if ('name' in item) {
    const translated = labels[item.name]
    if ('children' in item && item.children) {
      // Folder
      return {
        ...item,
        ...(translated ? { title: translated } : {}),
        children: item.children.map((child) => remapItem(child, labels)),
      } as PageMapItem
    }
    // MdxFile
    if (translated) {
      return { ...item, title: translated } as unknown as PageMapItem
    }
  }
  return item
}

/**
 * Localize a pageMap by replacing English sidebar labels with translated ones.
 * For en-US (default), returns the pageMap unchanged.
 */
export async function localizePageMap(
  pageMap: PageMapItem[],
  locale: Locale
): Promise<PageMapItem[]> {
  if (locale === defaultLocale) return pageMap

  const labels = await loadTranslatedMeta(locale)
  if (Object.keys(labels).length === 0) return pageMap

  return pageMap.map((item) => remapItem(item, labels))
}
