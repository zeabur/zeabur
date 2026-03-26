import type { Dictionary } from './en'
import type { Locale } from '../locales'

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  'en-US': () => import('./en').then((m) => m.default),
  'zh-TW': () => import('./zh-TW').then((m) => m.default),
  'zh-CN': () => import('./zh-CN').then((m) => m.default),
  'ja-JP': () => import('./ja-JP').then((m) => m.default),
  'es-ES': () => import('./es-ES').then((m) => m.default),
  'ko-KR': () => import('./ko-KR').then((m) => m.default),
  'id-ID': () => import('./id-ID').then((m) => m.default),
  'th-TH': () => import('./th-TH').then((m) => m.default),
  'fr-FR': () => import('./fr-FR').then((m) => m.default),
  'de-DE': () => import('./de-DE').then((m) => m.default),
  'it-IT': () => import('./it-IT').then((m) => m.default),
  'ar-SA': () => import('./ar-SA').then((m) => m.default),
  'pt-BR': () => import('./pt-BR').then((m) => m.default),
  'vi-VN': () => import('./vi-VN').then((m) => m.default),
  'hi-IN': () => import('./hi-IN').then((m) => m.default),
}

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  const loader = dictionaries[locale] || dictionaries['en-US']
  return loader()
}

export type { Dictionary } from './en'
