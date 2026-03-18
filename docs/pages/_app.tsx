import { useEffect } from 'react'
import { useRouter } from 'nextra/hooks'
import { LOCALE_LOCAL_STORAGE_KEY } from '../i18n-config'
import './styles.css'

const SCROLL_KEY = 'zeabur-docs-scroll'

export default function Nextra({ Component, pageProps }) {
  const router = useRouter()
  const { locale } = router

  // sync locale to localStorage when it changes
  useEffect(() => {
    window.localStorage.setItem(LOCALE_LOCAL_STORAGE_KEY, locale)
  }, [locale])

  // preserve hash across client-side navigation (i18n redirects strip the hash)
  useEffect(() => {
    let pendingHash = ''

    const handleStart = (url: string) => {
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
        const el = document.querySelector(hash)
        if (el) {
          el.scrollIntoView()
        }
        if (window.location.hash !== hash) {
          history.replaceState(null, '', window.location.pathname + window.location.search + hash)
        }
      })
    }

    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleComplete)
    return () => {
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleComplete)
    }
  }, [router.events])

  // restore scroll position on page refresh (non-hash pages only)
  useEffect(() => {
    if (window.location.hash) return
    const saved = sessionStorage.getItem(SCROLL_KEY)
    if (saved) {
      const { path, y } = JSON.parse(saved)
      if (path === router.asPath) {
        requestAnimationFrame(() => {
          window.scrollTo(0, y)
        })
      }
      sessionStorage.removeItem(SCROLL_KEY)
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
