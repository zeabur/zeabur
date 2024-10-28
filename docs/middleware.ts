export { middleware } from 'nextra/locales'

export const config = {
  matcher: [
    '/',
    '/((?!api|_next/static|_next/image|favicon.ico|icon.svg|apple-icon.png|manifest).*)'
  ]
}
