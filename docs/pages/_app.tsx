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

  // save & restore scroll position across page refreshes
  useEffect(() => {
    const saved = sessionStorage.getItem(SCROLL_KEY)
    if (saved) {
      const { path, y } = JSON.parse(saved)
      if (path === router.asPath) {
        // wait for layout to finish painting before restoring
        requestAnimationFrame(() => {
          window.scrollTo(0, y)
        })
      }
      sessionStorage.removeItem(SCROLL_KEY)
    }

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
