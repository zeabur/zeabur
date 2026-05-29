import { match as matchLocale } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'
import { addBasePath } from 'next/dist/client/add-base-path'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { LOCALE_COOKIE_NAME } from './i18n-config'

// This code is basically the same as the { middleware } from 'nextra/locales'
// see code in https://github.com/shuding/nextra/blob/main/packages/nextra/src/server/locales.ts
// only changed the cookie name from 'NEXT_LOCALE' to 'zeabur.lng'

const locales = JSON.parse(process.env.NEXTRA_LOCALES!) as string[]

const defaultLocale = process.env.NEXTRA_DEFAULT_LOCALE!

const HAS_LOCALE_RE = new RegExp(`^\\/(${locales.join('|')})(\\/|$)`)
const HAS_LOCALE_CI_RE = new RegExp(`^\\/(${locales.join('|')})(\\/|$)`, 'i')

function getHeadersLocale(request: NextRequest): string {
  const headers = Object.fromEntries(request.headers.entries())

  // Use negotiator and intl-localematcher to get best locale
  const languages = new Negotiator({ headers }).languages(locales)
  const locale = matchLocale(languages, locales, defaultLocale)

  return locale
}

// Find the canonical locale for a case-insensitive match
function findCanonicalLocale(segment: string): string | undefined {
  return locales.find(l => l.toLowerCase() === segment.toLowerCase())
}

// Build the redirect against the PUBLIC origin, not `request.url`.
// zeabur.com rewrites /docs/* to http://nextra-v2.zeabur.internal:8080, so
// `request.url`'s host is the internal upstream — using it leaks
// `nextra-v2.zeabur.internal` and triggers Google "Redirect error".
// A bare relative Location is also unusable: Next's middleware adapter
// normalizes the Location header via `new URL(location)` with no base, which
// throws `ERR_INVALID_URL` (500). So resolve the path against the public
// forwarded host: the Location is absolute (adapter-safe) and points at the
// user-facing domain.
//
// Behind multiple proxies `x-forwarded-*` can be comma-separated lists, so we
// take the first token; a malformed origin would otherwise re-introduce the
// `new URL` 500. As a last resort fall back to the (internal) request origin —
// a working redirect beats a 500.
function firstForwardedToken(value: string | null): string | undefined {
  return value?.split(',')[0]?.trim() || undefined
}

function safeRedirect(request: NextRequest, relativePath: string) {
  const host =
    firstForwardedToken(request.headers.get('x-forwarded-host')) ??
    firstForwardedToken(request.headers.get('host')) ??
    request.nextUrl.host
  const proto =
    firstForwardedToken(request.headers.get('x-forwarded-proto'))?.toLowerCase() === 'http'
      ? 'http'
      : 'https'
  try {
    return NextResponse.redirect(new URL(relativePath, `${proto}://${host}`))
  } catch {
    return NextResponse.redirect(new URL(relativePath, request.nextUrl.origin))
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if there is any supported locale in the pathname
  const pathnameHasLocale = HAS_LOCALE_RE.test(pathname)
  const cookieLocale = request.cookies.get(LOCALE_COOKIE_NAME)?.value

  // Handle case-insensitive locale match (e.g. /en-us → /en-US)
  if (!pathnameHasLocale && HAS_LOCALE_CI_RE.test(pathname)) {
    const [, segment] = pathname.split('/', 2)
    if (segment) {
      const canonical = findCanonicalLocale(segment)
      if (canonical) {
        const rest = pathname.slice(segment.length + 1) // +1 for leading slash
        const url = addBasePath(`/${canonical}${rest}${request.nextUrl.search}`)
        return safeRedirect(request, url)
      }
    }
  }

  // Redirect if there is no locale
  if (!pathnameHasLocale) {
    const locale = cookieLocale || getHeadersLocale(request)

    const url = addBasePath(`/${locale}${pathname}`)
    // e.g. incoming request is /products
    // The new URL is now /en-US/products
    return safeRedirect(request, url)
  }

  const [, requestLocale] = pathname.split('/', 2)

  if (requestLocale !== cookieLocale) {
    const response = NextResponse.next()
    response.cookies.set(LOCALE_COOKIE_NAME, requestLocale!)
    return response
  }
}

export const config = {
  matcher: [
    '/',
    '/((?!api|_next/static|_next/image|favicon|logo|apple-touch-icon|android-chrome|manifest|sitemap|favicon-controller).*)',
  ],
}
