import { NextResponse } from 'next/server'
import { LOCALE_COOKIE, isValidLocale } from '../../../../lib/i18n/locales'

export async function POST(request: Request) {
  try {
    const { locale } = await request.json()

    if (!locale || !isValidLocale(locale)) {
      return NextResponse.json({ error: 'Invalid locale' }, { status: 400 })
    }

    const response = NextResponse.json({ ok: true })
    response.cookies.set(LOCALE_COOKIE, locale, {
      path: '/',
      maxAge: 365 * 24 * 60 * 60,
      sameSite: 'lax',
    })

    return response
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
