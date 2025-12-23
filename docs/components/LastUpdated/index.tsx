import { useRouter } from 'nextra/hooks'

interface LastUpdatedProps {
  timestamp: Date
}

const translations: Record<string, { prefix: string; dateOptions: Intl.DateTimeFormatOptions }> = {
  'en-US': {
    prefix: 'Last updated on',
    dateOptions: { year: 'numeric', month: 'long', day: 'numeric' },
  },
  'zh-TW': {
    prefix: '最後更新於',
    dateOptions: { year: 'numeric', month: 'long', day: 'numeric' },
  },
  'zh-CN': {
    prefix: '最后更新于',
    dateOptions: { year: 'numeric', month: 'long', day: 'numeric' },
  },
  'ja-JP': {
    prefix: '最終更新日',
    dateOptions: { year: 'numeric', month: 'long', day: 'numeric' },
  },
  'es-ES': {
    prefix: 'Última actualización',
    dateOptions: { year: 'numeric', month: 'long', day: 'numeric' },
  },
}

export default function LastUpdated({ timestamp }: LastUpdatedProps) {
  const router = useRouter()
  const locale = router.locale || 'en-US'
  
  const { prefix, dateOptions } = translations[locale] || translations['en-US']
  const formattedDate = timestamp.toLocaleDateString(locale, dateOptions)

  return (
    <span className="nx-text-xs nx-text-gray-500 dark:nx-text-gray-400">
      {prefix} {formattedDate}
    </span>
  )
}

