export type Locale =
  | 'en-US'
  | 'zh-TW'
  | 'zh-CN'
  | 'ja-JP'
  | 'es-ES'

export const locales: Locale[] = [
  'en-US',
  'zh-TW',
  'zh-CN',
  'ja-JP',
  'es-ES',
]

export const defaultLocale: Locale = 'en-US'

export const localeNames: Record<Locale, string> = {
  'en-US': 'English',
  'zh-TW': '繁體中文',
  'zh-CN': '简体中文',
  'ja-JP': '日本語',
  'es-ES': 'Español',
}

export const LOCALE_COOKIE = 'zeabur.lng'
export const LOCALE_STORAGE_KEY = 'zeabur.lng'

export function isValidLocale(value: string): value is Locale {
  return locales.includes(value as Locale)
}
