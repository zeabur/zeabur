import { match as matchLocale } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'
import { locales, defaultLocale, LOCALE_COOKIE, isValidLocale } from './locales'
import type { Locale } from './locales'

export function getLocaleFromHeaders(headers: Headers): Locale {
  // 1. Check x-locale header (set by middleware)
  const xLocale = headers.get('x-locale')
  if (xLocale && isValidLocale(xLocale)) {
    return xLocale
  }

  // 2. Check cookie
  const cookieHeader = headers.get('cookie')
  if (cookieHeader) {
    const cookies = Object.fromEntries(
      cookieHeader.split(';').map((c) => {
        const [key, ...val] = c.trim().split('=')
        return [key, val.join('=')]
      })
    )
    const cookieLocale = cookies[LOCALE_COOKIE]
    if (cookieLocale && isValidLocale(cookieLocale)) {
      return cookieLocale
    }
  }

  // 3. Accept-Language negotiation
  try {
    const negotiatorHeaders = Object.fromEntries(headers.entries())
    const languages = new Negotiator({ headers: negotiatorHeaders }).languages(
      locales as unknown as string[]
    )
    return matchLocale(languages, locales, defaultLocale) as Locale
  } catch {
    return defaultLocale
  }
}
