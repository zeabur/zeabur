import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { locales, defaultLocale, LOCALE_COOKIE } from './lib/i18n/locales'
import { getLocaleFromHeaders } from './lib/i18n/get-locale'
import type { Locale } from './lib/i18n/locales'

// Build locale regex patterns
const localeSet = new Set<string>(locales)
const localePattern = locales.join('|')
const HAS_LOCALE_RE = new RegExp(`^\\/(${localePattern})(\\/|$)`)
const HAS_LOCALE_CI_RE = new RegExp(`^\\/(${localePattern})(\\/|$)`, 'i')

function findCanonicalLocale(segment: string): Locale | undefined {
  const lower = segment.toLowerCase()
  return locales.find((l) => l.toLowerCase() === lower)
}

/**
 * Create a redirect URL that respects basePath.
 * request.nextUrl already knows the basePath — cloning it and setting
 * .pathname will produce a full URL with basePath included.
 */
function redirectWithBasePath(request: NextRequest, pathname: string) {
  const url = request.nextUrl.clone()
  url.pathname = pathname
  return url
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
        return NextResponse.redirect(
          redirectWithBasePath(request, `/${canonical}${rest}`)
        )
      }
    }
  }

  // No locale prefix — detect locale and redirect to add prefix
  if (!pathnameHasLocale) {
    const locale =
      (cookieLocale && localeSet.has(cookieLocale) ? cookieLocale : null) ||
      getLocaleFromHeaders(request.headers)

    const response = NextResponse.redirect(
      redirectWithBasePath(request, `/${locale}${pathname === '/' ? '' : pathname}`)
    )
    if (cookieLocale !== locale) {
      response.cookies.set(LOCALE_COOKIE, locale)
    }
    return response
  }

  // Has locale prefix — extract it, set cookie, pass through
  const [, requestLocale] = pathname.split('/', 2)
  const locale = requestLocale as Locale

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
