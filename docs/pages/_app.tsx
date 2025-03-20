import { useEffect } from 'react'
import './styles.css'
import { useRouter } from 'nextra/hooks'

export const LOCALE_LOCAL_STORAGE_KEY = 'zeabur.lng'

export default function Nextra({ Component, pageProps }) {
  const router = useRouter()
  const { locale } = router

  useEffect(() => {
    localStorage.setItem(LOCALE_LOCAL_STORAGE_KEY, locale)
  }, [locale])

  return <Component {...pageProps} />
}
