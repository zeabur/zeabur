'use client'

import React, { createContext, useContext, useCallback, useMemo } from 'react'
import type { Locale } from '../lib/i18n/locales'
import type { Dictionary } from '../lib/i18n/dictionaries'
import { LOCALE_COOKIE } from '../lib/i18n/locales'

interface LocaleContextValue {
  locale: Locale
  dictionary: Dictionary
  setLocale: (locale: Locale) => void
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

export function useLocale() {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider')
  return ctx
}

interface LocaleProviderProps {
  locale: Locale
  dictionary: Dictionary
  children: React.ReactNode
}

export function LocaleProvider({ locale, dictionary, children }: LocaleProviderProps) {
  const setLocale = useCallback((newLocale: Locale) => {
    // Set cookie
    document.cookie = `${LOCALE_COOKIE}=${newLocale};path=/;max-age=${365 * 24 * 60 * 60};samesite=lax`
    // Navigate to new locale URL
    const { pathname, search } = window.location
    // Remove current locale prefix if present
    const localePrefix = `/${locale}`
    const pathWithoutLocale = pathname.startsWith(localePrefix + '/') || pathname === localePrefix
      ? pathname.slice(localePrefix.length) || '/'
      : pathname

    const newPath = newLocale === 'en-US'
      ? pathWithoutLocale
      : `/${newLocale}${pathWithoutLocale}`

    window.location.href = newPath + search
  }, [locale])

  const value = useMemo(
    () => ({ locale, dictionary, setLocale }),
    [locale, dictionary, setLocale]
  )

  return (
    <LocaleContext.Provider value={value}>
      {children}
    </LocaleContext.Provider>
  )
}
