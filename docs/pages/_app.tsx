import { useEffect } from 'react'
import { useRouter } from 'nextra/hooks'
import type { AppProps } from 'next/app'
import { LOCALE_LOCAL_STORAGE_KEY } from '../i18n-config'
// Import fonts to ensure next/font CSS is included in the client bundle
// (font classes are SSR'd on <html> via _document.js)
import { fontVariableClasses as _fontVars } from '../lib/fonts'
import './styles.css'

// Prevent tree-shaking — font CSS must be in the client bundle
void _fontVars

const SCROLL_KEY = 'zeabur-docs-scroll'

export default function Nextra({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const { locale } = router

  // Set lang attribute for :lang() CSS selectors (CJK font priority)
  useEffect(() => {
    document.documentElement.lang = locale || 'en-US'
  }, [locale])

  // sync locale to localStorage when it changes
  useEffect(() => {
    if (window.localStorage.getItem(LOCALE_LOCAL_STORAGE_KEY) === locale) return
    window.localStorage.setItem(LOCALE_LOCAL_STORAGE_KEY, locale)
  }, [locale])

  // preserve hash across client-side navigation (i18n redirects strip the hash)
  useEffect(() => {
    let pendingHash = ''

    const handleStart = (url: string) => {
      pendingHash = ''
      const hashIndex = url.indexOf('#')
      if (hashIndex !== -1) {
        pendingHash = url.slice(hashIndex)
      }
    }

    const handleComplete = () => {
      if (!pendingHash) return
      const hash = pendingHash
      pendingHash = ''
      requestAnimationFrame(() => {
        let id = hash.slice(1)
        try {
          id = decodeURIComponent(id)
        } catch {
          // keep raw fragment if percent-encoding is malformed
        }
        const el = document.getElementById(id)
        if (el) {
          el.scrollIntoView()
        }
        if (window.location.hash !== hash) {
          history.replaceState(history.state, '', window.location.pathname + window.location.search + hash)
        }
      })
    }

    const handleError = () => {
      pendingHash = ''
    }

    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleComplete)
    router.events.on('routeChangeError', handleError)
    return () => {
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleComplete)
      router.events.off('routeChangeError', handleError)
    }
  }, [router.events])

  // restore scroll position on page refresh (non-hash pages only)
  useEffect(() => {
    if (window.location.hash) {
      sessionStorage.removeItem(SCROLL_KEY)
      return
    }
    const saved = sessionStorage.getItem(SCROLL_KEY)
    if (saved) {
      try {
        const { path, y } = JSON.parse(saved)
        if (path === router.asPath && typeof y === 'number' && Number.isFinite(y)) {
          requestAnimationFrame(() => {
            window.scrollTo(0, y)
          })
        }
      } catch {
        // ignore malformed data
      } finally {
        sessionStorage.removeItem(SCROLL_KEY)
      }
    }
  }, [router.asPath])

  // save scroll position before page unload
  useEffect(() => {
    const onBeforeUnload = () => {
      sessionStorage.setItem(
        SCROLL_KEY,
        JSON.stringify({ path: router.asPath, y: window.scrollY })
      )
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [router.asPath])

  // rewrite zeabur.com links to zeabur.cn when served from zeabur.cn
  useEffect(() => {
    if (!window.location.hostname.endsWith('zeabur.cn')) return

    const rewriteLink = (a: HTMLAnchorElement) => {
      try {
        const url = new URL(a.href)
        if (url.hostname === 'zeabur.com' || url.hostname.endsWith('.zeabur.com')) {
          url.hostname = url.hostname.replace(/zeabur\.com$/, 'zeabur.cn')
          a.href = url.href
        }
      } catch {
        // ignore invalid URLs
      }
    }

    // initial pass
    document.querySelectorAll<HTMLAnchorElement>('a[href]').forEach((a) => {
      rewriteLink(a)
    })

    // only scan newly added nodes instead of the entire DOM
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return
          if (node instanceof HTMLAnchorElement) {
            rewriteLink(node)
          }
          node.querySelectorAll<HTMLAnchorElement>('a[href]').forEach(rewriteLink)
        })
      })
    })
    observer.observe(document.body, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [router.asPath])

  return <Component {...pageProps} />
}
