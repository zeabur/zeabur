'use client'

import React from 'react'
import { useLocale } from './locale-provider'
import { locales, localeNames } from '../lib/i18n/locales'
import type { Locale } from '../lib/i18n/locales'

export function LocaleSwitcher() {
  const { locale: currentLocale, setLocale } = useLocale()

  return (
    <select
      value={currentLocale}
      onChange={(e) => setLocale(e.target.value as Locale)}
      aria-label="Change language"
      style={{
        background: 'transparent',
        border: '1px solid var(--zb-text-muted, #787774)',
        borderRadius: '6px',
        padding: '4px 8px',
        fontSize: '14px',
        color: 'inherit',
        cursor: 'pointer',
      }}
    >
      {locales.map((loc) => (
        <option key={loc} value={loc}>
          {localeNames[loc]}
        </option>
      ))}
    </select>
  )
}
