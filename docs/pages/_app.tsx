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
  return <Component {...pageProps} />
}
