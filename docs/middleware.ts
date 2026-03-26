import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { locales, defaultLocale, LOCALE_COOKIE, isRtl } from './lib/i18n/locales'
import { getLocaleFromHeaders } from './lib/i18n/get-locale'
import type { Locale } from './lib/i18n/locales'

// Build locale regex patterns
const localeSet = new Set(locales)
const localePattern = locales.join('|')
const HAS_LOCALE_RE = new RegExp(`^\\/(${localePattern})(\\/|$)`)
const HAS_LOCALE_CI_RE = new RegExp(`^\\/(${localePattern})(\\/|$)`, 'i')

function findCanonicalLocale(segment: string): Locale | undefined {
  const lower = segment.toLowerCase()
  return locales.find((l) => l.toLowerCase() === lower)
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const pathnameHasLocale = HAS_LOCALE_RE.test(pathname)
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value

  // Handle case-insensitive locale match (e.g., /en-us → /en-US)
  if (!pathnameHasLocale && HAS_LOCALE_CI_RE.test(pathname)) {
    const [, segment] = pathname.split('/', 2)
    if (segment) {
      const canonical = findCanonicalLocale(segment)
      if (canonical) {
        const rest = pathname.slice(segment.length + 1)
        const url = new URL(`/${canonical}${rest}${request.nextUrl.search}`, request.url)
        return NextResponse.redirect(url)
      }
    }
  }

  // For default locale (en-US): serve without prefix, rewrite internally
  if (!pathnameHasLocale) {
    const locale = (cookieLocale && localeSet.has(cookieLocale as Locale) ? cookieLocale : null) as Locale | null
      || getLocaleFromHeaders(request.headers)

    if (locale === defaultLocale) {
      // Default locale: no prefix in URL, rewrite to /en-US/... internally
      const response = NextResponse.rewrite(
        new URL(`/${defaultLocale}${pathname}`, request.url)
      )
      response.headers.set('x-locale', defaultLocale)
      if (cookieLocale !== defaultLocale) {
        response.cookies.set(LOCALE_COOKIE, defaultLocale)
      }
      return response
    }

    // Non-default locale: redirect to add prefix
    const url = new URL(`/${locale}${pathname}${request.nextUrl.search}`, request.url)
    const response = NextResponse.redirect(url)
    response.cookies.set(LOCALE_COOKIE, locale)
    return response
  }

  // Extract locale from pathname
  const [, requestLocale] = pathname.split('/', 2)
  const locale = requestLocale as Locale

  // If it's the default locale with a prefix, redirect to remove prefix
  if (locale === defaultLocale) {
    const rest = pathname.slice(defaultLocale.length + 1) || '/'
    const url = new URL(`${rest}${request.nextUrl.search}`, request.url)
    return NextResponse.redirect(url)
  }

  // Non-default locale with prefix: rewrite and set headers
  const response = NextResponse.next()
  response.headers.set('x-locale', locale)
  if (locale !== cookieLocale) {
    response.cookies.set(LOCALE_COOKIE, locale)
  }

  return response
}

export const config = {
  matcher: [
    '/',
    '/((?!api|_next/static|_next/image|_pagefind|favicon|logo|apple-touch-icon|android-chrome|manifest|sitemap|favicon-controller).*)',
  ],
}
