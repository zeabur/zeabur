import { useEffect } from 'react'
import { useRouter } from 'nextra/hooks'
import i18n from '../i18n-config'
import { LOCALE_LOCAL_STORAGE_KEY } from './_app'

export default function Page() {
  const router = useRouter()
  const { locale } = router

  useEffect(() => {
    if (typeof window === 'undefined') return

    const storedLocale = localStorage.getItem(LOCALE_LOCAL_STORAGE_KEY)
    const navigatorLocale = navigator.language

    if (
      storedLocale &&
      storedLocale !== locale &&
      i18n.locales.includes(storedLocale)
    ) {
      router.push(`/${storedLocale}`)
    } else if (
      !storedLocale &&
      navigatorLocale &&
      i18n.locales.includes(navigatorLocale)
    ) {
      router.push(`/${navigatorLocale}`)
    } else {
      router.push(`/${i18n.defaultLocale}`)
    }
  }, [router, locale])

  return <div></div>
}
