import config from '../i18n-config.js'
export const locales: string[] = config.locales
export const localeNames: Record<string, string> = {
  'en-US': 'English',
  'zh-TW': 'Traditional Chinese',
  'zh-CN': 'Simplified Chinese',
  'ja-JP': 'Japanese',
  'es-ES': 'Spanish',
}
export function isValidLocale(value: string) {
  return locales.includes(value)
}
