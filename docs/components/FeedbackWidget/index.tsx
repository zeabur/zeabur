import { useState, useCallback } from 'react'
import { useRouter } from 'nextra/hooks'
import { useZeaburAuth } from './useZeaburAuth'

type Rating = 1 | 2 | 3 | 4

const EMOJIS: { value: Rating; icon: string; label: string }[] = [
  { value: 1, icon: '😞', label: 'Not helpful' },
  { value: 2, icon: '🙁', label: 'Slightly helpful' },
  { value: 3, icon: '🙂', label: 'Helpful' },
  { value: 4, icon: '😃', label: 'Very helpful' },
]

type Locale = 'en-US' | 'zh-TW' | 'zh-CN' | 'ja-JP' | 'es-ES'

const i18n: Record<Locale, Record<string, string>> = {
  'en-US': {
    heading: 'Was this page helpful?',
    placeholder: 'Any additional feedback? (optional)',
    send: 'Send feedback',
    thanks: 'Thanks for your feedback!',
    error: 'Failed to send feedback. Please try again.',
  },
  'zh-TW': {
    heading: '這個頁面有幫助嗎？',
    placeholder: '其他意見回饋？（選填）',
    send: '送出回饋',
    thanks: '感謝您的回饋！',
    error: '送出失敗，請再試一次。',
  },
  'zh-CN': {
    heading: '此页面有帮助吗？',
    placeholder: '其他意见反馈？（选填）',
    send: '提交反馈',
    thanks: '感谢您的反馈！',
    error: '提交失败，请重试。',
  },
  'ja-JP': {
    heading: 'このページは役に立ちましたか？',
    placeholder: 'その他のフィードバック（任意）',
    send: 'フィードバックを送信',
    thanks: 'フィードバックありがとうございます！',
    error: '送信に失敗しました。もう一度お試しください。',
  },
  'es-ES': {
    heading: '¿Te resultó útil esta página?',
    placeholder: '¿Algún comentario adicional? (opcional)',
    send: 'Enviar comentario',
    thanks: '¡Gracias por tu opinión!',
    error: 'Error al enviar. Inténtalo de nuevo.',
  },
}

interface FeedbackWidgetProps {
  variant?: 'inline' | 'toc'
}

export default function FeedbackWidget({ variant = 'inline' }: FeedbackWidgetProps) {
  const router = useRouter()
  const locale = (router.locale ?? 'en-US') as Locale
  const t = i18n[locale] ?? i18n['en-US']

  const { user } = useZeaburAuth()

  const [rating, setRating] = useState<Rating | null>(null)
  const [feedback, setFeedback] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const handleSubmit = useCallback(async () => {
    if (!rating) return
    setStatus('sending')

    try {
      const res = await fetch('/docs/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          page: router.pathname.replace(/^\/[a-z]{2}-[A-Z]{2}/, ''),
          locale,
          rating,
          feedback: feedback.trim() || undefined,
          userId: user?._id ?? null,
          username: user?.username ?? null,
        }),
      })

      if (!res.ok) throw new Error('Request failed')
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }, [rating, feedback, router.pathname, locale, user])

  if (status === 'sent') {
    return (
      <div className={`feedback-widget ${variant === 'toc' ? 'feedback-toc' : 'feedback-inline'}`}>
        <p className="feedback-thanks">{t.thanks}</p>
      </div>
    )
  }

  return (
    <div className={`feedback-widget ${variant === 'toc' ? 'feedback-toc' : 'feedback-inline'}`}>
      <p className="feedback-heading">{t.heading}</p>

      <div className="feedback-emojis">
        {EMOJIS.map((e) => (
          <button
            key={e.value}
            type="button"
            className={`feedback-emoji ${rating === e.value ? 'active' : ''}`}
            onClick={() => setRating(e.value)}
            title={e.label}
            aria-label={e.label}
          >
            {e.icon}
          </button>
        ))}
      </div>

      {rating !== null && (
        <div className="feedback-form">
          <textarea
            className="feedback-textarea"
            placeholder={t.placeholder}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={3}
          />
          <button
            type="button"
            className="feedback-send"
            disabled={status === 'sending'}
            onClick={handleSubmit}
          >
            {status === 'sending' ? '...' : t.send}
          </button>
          {status === 'error' && (
            <p className="feedback-error">{t.error}</p>
          )}
        </div>
      )}
    </div>
  )
}
