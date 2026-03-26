export type Locale =
  | 'en-US'
  | 'zh-TW'
  | 'zh-CN'
  | 'ja-JP'
  | 'es-ES'
  | 'ko-KR'
  | 'id-ID'
  | 'th-TH'
  | 'fr-FR'
  | 'de-DE'
  | 'it-IT'
  | 'ar-SA'
  | 'pt-BR'
  | 'vi-VN'
  | 'hi-IN'

export const locales: Locale[] = [
  'en-US',
  'zh-TW',
  'zh-CN',
  'ja-JP',
  'es-ES',
  'ko-KR',
  'id-ID',
  'th-TH',
  'fr-FR',
  'de-DE',
  'it-IT',
  'ar-SA',
  'pt-BR',
  'vi-VN',
  'hi-IN',
]

export const defaultLocale: Locale = 'en-US'

export const localeNames: Record<Locale, string> = {
  'en-US': 'English',
  'zh-TW': '繁體中文',
  'zh-CN': '简体中文',
  'ja-JP': '日本語',
  'es-ES': 'Español',
  'ko-KR': '한국어',
  'id-ID': 'Bahasa Indonesia',
  'th-TH': 'ไทย',
  'fr-FR': 'Français',
  'de-DE': 'Deutsch',
  'it-IT': 'Italiano',
  'ar-SA': 'العربية',
  'pt-BR': 'Português',
  'vi-VN': 'Tiếng Việt',
  'hi-IN': 'हिन्दी',
}

export const rtlLocales: Locale[] = ['ar-SA']

export const LOCALE_COOKIE = 'zeabur.lng'
export const LOCALE_STORAGE_KEY = 'zeabur.lng'

export function isValidLocale(value: string): value is Locale {
  return locales.includes(value as Locale)
}

export function isRtl(locale: Locale): boolean {
  return rtlLocales.includes(locale)
}
