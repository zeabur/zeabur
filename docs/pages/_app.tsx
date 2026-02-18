import { useEffect } from 'react'
import { useRouter } from 'nextra/hooks'
import { LOCALE_LOCAL_STORAGE_KEY } from '../i18n-config'
import './styles.css'

export default function Nextra({ Component, pageProps }) {
  const router = useRouter()
  const { locale } = router

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
