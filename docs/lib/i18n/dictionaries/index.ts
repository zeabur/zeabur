import type { Dictionary } from './en'
import type { Locale } from '../locales'

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  'en-US': () => import('./en').then((m) => m.default),
  'zh-TW': () => import('./zh-TW').then((m) => m.default),
  'zh-CN': () => import('./zh-CN').then((m) => m.default),
  'ja-JP': () => import('./ja-JP').then((m) => m.default),
  'es-ES': () => import('./es-ES').then((m) => m.default),
}

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  const loader = dictionaries[locale] || dictionaries['en-US']
  return loader()
}

export type { Dictionary } from './en'
