import { useEffect } from 'react'
import { useRouter } from 'nextra/hooks'
import { LOCALE_LOCAL_STORAGE_KEY } from '../i18n-config'
// Import fonts to ensure next/font CSS is included in the client bundle
// (font classes are SSR'd on <html> via _document.js)
import { fontVariableClasses as _fontVars } from '../lib/fonts'
import './styles.css'

// Prevent tree-shaking — font CSS must be in the client bundle
void _fontVars

export default function Nextra({ Component, pageProps }) {
  const router = useRouter()
  const { locale } = router

  // Set lang attribute for :lang() CSS selectors (CJK font priority)
  useEffect(() => {
    document.documentElement.lang = locale || 'en-US'
  }, [locale])

  // sync locale to localStorage when it changes
  useEffect(() => {
    window.localStorage.setItem(LOCALE_LOCAL_STORAGE_KEY, locale)
  }, [locale])

  // rewrite zeabur.com links to zeabur.cn when served from zeabur.cn
  useEffect(() => {
    if (!window.location.hostname.endsWith('zeabur.cn')) return

    const rewriteLinks = () => {
      document.querySelectorAll<HTMLAnchorElement>('a[href*="zeabur.com"]').forEach((a) => {
        a.href = a.href.replace(/zeabur\.com/g, 'zeabur.cn')
      })
    }

    rewriteLinks()

    const observer = new MutationObserver(rewriteLinks)
    observer.observe(document.body, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [router.asPath])

  return <Component {...pageProps} />
}
