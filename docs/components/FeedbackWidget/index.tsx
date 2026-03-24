import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'nextra/hooks'

const TURNSTILE_SITEKEY =
  typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? '1x00000000000000000000AA'
    : '0x4AAAAAACCyo_1UnKEIQB-R'

type Rating = 1 | 2 | 3 | 4
type Status = 'idle' | 'expanded' | 'submitting' | 'success' | 'error'

function useTurnstile() {
  const tokenRef = useRef<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && !(window as any).turnstile) {
      const script = document.createElement('script')
      script.src =
        'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
      script.async = true
      document.head.appendChild(script)
    }

    const renderWidget = () => {
      if (
        containerRef.current &&
        (window as any).turnstile &&
        widgetIdRef.current === null
      ) {
        widgetIdRef.current = (window as any).turnstile.render(
          containerRef.current,
          {
            sitekey: TURNSTILE_SITEKEY,
            size: 'compact',
            callback: (token: string) => {
              tokenRef.current = token
            },
          }
        )
      }
    }

    const interval = setInterval(() => {
      if ((window as any).turnstile) {
        renderWidget()
        clearInterval(interval)
      }
    }, 200)

    return () => clearInterval(interval)
  }, [])

  const getToken = useCallback(async (): Promise<string | null> => {
    if (tokenRef.current) return tokenRef.current
    if ((window as any).turnstile && widgetIdRef.current !== null) {
      ;(window as any).turnstile.reset(widgetIdRef.current)
      return new Promise((resolve) => {
        let attempts = 0
        const check = setInterval(() => {
          attempts++
          if (tokenRef.current) {
            clearInterval(check)
            resolve(tokenRef.current)
          } else if (attempts > 50) {
            clearInterval(check)
            resolve(null)
          }
        }, 100)
      })
    }
    return null
  }, [])

  const resetToken = useCallback(() => {
    tokenRef.current = null
    if ((window as any).turnstile && widgetIdRef.current !== null) {
      ;(window as any).turnstile.reset(widgetIdRef.current)
    }
  }, [])

  return { containerRef, getToken, resetToken }
}

const EMOJIS: { value: Rating; icon: string; label: string }[] = [
  { value: 1, icon: '😞', label: 'Not helpful' },
  { value: 2, icon: '🙁', label: 'Slightly helpful' },
  { value: 3, icon: '🙂', label: 'Helpful' },
  { value: 4, icon: '😃', label: 'Very helpful' },
]

const i18n: Record<string, Record<string, string>> = {
  'en-US': {
    heading: 'Was this page helpful?',
    placeholder: 'Your feedback (optional)...',
    send: 'Send',
    login: 'Please log in first',
    thanks: 'Thank you for your feedback!',
    viewPost: 'View on Forum',
    error: 'Failed to send. Please try again.',
    retry: 'Retry',
  },
  'zh-TW': {
    heading: '這個頁面有幫助嗎？',
    placeholder: '您的回饋（可選）...',
    send: '送出',
    login: '請先登入',
    thanks: '感謝您的回饋！',
    viewPost: '在論壇查看',
    error: '傳送失敗，請重試。',
    retry: '重試',
  },
  'zh-CN': {
    heading: '这个页面有帮助吗？',
    placeholder: '您的反馈（可选）...',
    send: '发送',
    login: '请先登录',
    thanks: '感谢您的反馈！',
    viewPost: '在论坛查看',
    error: '发送失败，请重试。',
    retry: '重试',
  },
  'ja-JP': {
    heading: 'このページは役に立ちましたか？',
    placeholder: 'フィードバック（任意）...',
    send: '送信',
    login: 'ログインしてください',
    thanks: 'フィードバックありがとうございます！',
    viewPost: 'フォーラムで見る',
    error: '送信に失敗しました。もう一度お試しください。',
    retry: '再試行',
  },
  'es-ES': {
    heading: '¿Fue útil esta página?',
    placeholder: 'Tu comentario (opcional)...',
    send: 'Enviar',
    login: 'Inicia sesión primero',
    thanks: '¡Gracias por tu comentario!',
    viewPost: 'Ver en el foro',
    error: 'Error al enviar. Inténtalo de nuevo.',
    retry: 'Reintentar',
  },
}

const RATING_LABELS: Record<string, string[]> = {
  'en-US': ['Not helpful', 'Slightly helpful', 'Helpful', 'Very helpful'],
  'zh-TW': ['沒有幫助', '稍有幫助', '有幫助', '非常有幫助'],
  'zh-CN': ['没有帮助', '稍有帮助', '有帮助', '非常有帮助'],
  'ja-JP': ['役に立たない', '少し役立つ', '役立つ', 'とても役立つ'],
  'es-ES': ['No útil', 'Algo útil', 'Útil', 'Muy útil'],
}

/**
 * variant:
 *   - "toc": compact, rendered in the TOC sidebar (desktop only, hidden below xl)
 *   - "inline": rendered below main content (mobile only, hidden at xl+)
 */
export default function FeedbackWidget({ variant = 'toc' }: { variant?: 'toc' | 'inline' }) {
  const router = useRouter()
  const locale = router.locale || 'en-US'
  const t = i18n[locale] || i18n['en-US']
  const ratingLabels = RATING_LABELS[locale] || RATING_LABELS['en-US']

  const { containerRef, getToken, resetToken } = useTurnstile()

  const [rating, setRating] = useState<Rating | null>(null)
  const [feedback, setFeedback] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleRating = (value: Rating) => {
    setRating(value)
    if (status === 'idle') setStatus('expanded')
  }

  const handleSubmit = async () => {
    if (!rating) return

    setStatus('submitting')
    setErrorMsg('')

    try {
      const turnstileToken = await getToken()
      if (!turnstileToken) {
        setErrorMsg('Turnstile verification failed. Please refresh and try again.')
        setStatus('error')
        return
      }

      const page = router.asPath.replace(/^\/[a-z]{2}-[A-Z]{2}/, '').replace(/#.*$/, '')

      const res = await fetch('https://api.zeabur.dev/graphql', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `mutation SubmitDocFeedback($input: DocFeedbackInput!) {
            submitDocFeedback(input: $input)
          }`,
          variables: {
            input: {
              page,
              locale,
              rating,
              feedback: feedback.trim() || null,
              turnstileToken,
            },
          },
        }),
      })

      const json = await res.json()
      if (json.errors) {
        throw new Error(json.errors[0]?.message || t.error)
      }

      setStatus('success')
    } catch (err: any) {
      setErrorMsg(err.message || t.error)
      setStatus('error')
      resetToken()
    }
  }

  const handleRetry = () => {
    setStatus('expanded')
    setErrorMsg('')
  }

  const visibilityClass = variant === 'inline'
    ? 'feedback-mobile-only'
    : ''

  if (status === 'success') {
    return (
      <div className={`feedback-widget ${visibilityClass}`}>
        <div className="feedback-success">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.7-10.3a.75.75 0 00-1.06-1.06L9 10.29 7.36 8.64a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.06 0l4.09-4.25z"
              fill="currentColor"
            />
          </svg>
          <span>{t.thanks}</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`feedback-widget ${visibilityClass}`}>
      <p className="feedback-heading">{t.heading}</p>

      <div className="feedback-emojis">
        {EMOJIS.map((emoji) => (
          <button
            key={emoji.value}
            type="button"
            className={`feedback-emoji ${rating === emoji.value ? 'active' : ''}`}
            onClick={() => handleRating(emoji.value)}
            title={ratingLabels[emoji.value - 1]}
            aria-label={ratingLabels[emoji.value - 1]}
          >
            {emoji.icon}
          </button>
        ))}
      </div>

      {(status === 'expanded' || status === 'submitting' || status === 'error') && (
        <div className="feedback-form">
          <textarea
            className="feedback-textarea"
            placeholder={t.placeholder}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={3}
            disabled={status === 'submitting'}
          />

          <div className="feedback-actions">
            {status === 'error' && (
              <span className="feedback-error">{errorMsg || t.error}</span>
            )}

            <button
              type="button"
              className="feedback-send"
              onClick={status === 'error' ? handleRetry : handleSubmit}
              disabled={status === 'submitting'}
            >
              {status === 'submitting' ? (
                <span className="feedback-spinner" />
              ) : status === 'error' ? (
                t.retry
              ) : (
                t.send
              )}
            </button>
          </div>
        </div>
      )}

      <div ref={containerRef} style={{ display: 'none' }} />
    </div>
  )
}
