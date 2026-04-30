import { useRouter } from 'nextra/hooks'
import manifest from '../../lib/last-updated.json'

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

export default function LastUpdated() {
  const router = useRouter()
  const locale = router.locale || 'en-US'
  const route = router.asPath.split(/[?#]/)[0].replace(/\/$/, '') || `/${locale}`
  const iso = (manifest as Record<string, string>)[route]
  if (!iso) return null

  const { prefix, dateOptions } = translations[locale] || translations['en-US']
  const formattedDate = new Date(iso).toLocaleDateString(locale, dateOptions)

  return (
    <div className="_mt-12 _mb-8 _block _text-xs _text-gray-500 ltr:_text-right rtl:_text-left dark:_text-gray-400">
      <time dateTime={iso}>
        {prefix} {formattedDate}
      </time>
    </div>
  )
}
