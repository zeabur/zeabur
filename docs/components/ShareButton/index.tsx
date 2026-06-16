// MKT-2511 v0.1 — share button for Zeabur docs (Nextra).
// SoT: zeabur.com/src/components/ShareButton (this is a copy with docs-flavoured tweaks).
// Differences from SoT:
//   - sonner not installed in docs → inline "Copied" state on the button itself (FeedbackWidget pattern).
//   - User comes from useZeaburAuth (cookie + REST GraphQL) instead of Apollo useSession.
//   - 5 locales (docs site doesn't ship id-ID).
import { useState } from 'react'
import { useRouter } from 'nextra/hooks'

import { useZeaburAuth } from '../FeedbackWidget/useZeaburAuth'

const DEFAULT_DISCOUNT = 5

// PostHog public token (same project as zeabur.com — see pages/_app.tsx there).
// Docs doesn't ship the posthog-js SDK, so we POST directly to the capture API.
const POSTHOG_KEY = 'phc_TcgrjtKUGtTltFwWGj2Xhmuyv5ZHtrufIE8wgkLsruD'
const POSTHOG_HOST = 'https://us.i.posthog.com'

// Matches ShareButtonEventProperties in zeabur.com/src/utils/posthog.ts.
// Single event + `surface` discriminator (navbar_menu_item_clicked precedent);
// see the sibling PR description for the design audit.
function captureShareButtonClicked(props: {
  user_id: string
  username?: string
  source_url: string
  locale: string
  share_method: 'native_share' | 'clipboard'
}) {
  if (typeof window === 'undefined') return
  fetch(`${POSTHOG_HOST}/capture/`, {
    method: 'POST',
    keepalive: true,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: POSTHOG_KEY,
      event: 'share_button_clicked',
      distinct_id: props.user_id,
      properties: {
        user_id: props.user_id,
        username: props.username,
        is_logged_in: true,
        surface: 'docs',
        source_url: props.source_url,
        locale: props.locale,
        share_method: props.share_method,
        has_referral_code: true,
        timestamp: Date.now(),
      },
    }),
  }).catch(() => {
    // best-effort; swallow network errors so share UX still works
  })
}

const SHARE_MESSAGES: Record<string, string> = {
  'en-US':
    'Purchase servers or AI Hub credits at {{url}} — enter my referral code "{{code}}" at checkout to enjoy {{discount}}% off!',
  'zh-TW':
    '在 {{url}} 購買伺服器或 AI Hub 額度，結帳時輸入我的推薦碼「{{code}}」，即可享受 {{discount}}% 折扣優惠～',
  'zh-CN':
    '在 {{url}} 购买服务器或 AI Hub 额度，结账时输入我的推荐码「{{code}}」，即可享受 {{discount}}% 折扣优惠～',
  'ja-JP':
    '{{url}} でサーバーや AI Hub クレジットを購入する際、チェックアウトで紹介コード「{{code}}」を入力すると {{discount}}% オフになります！',
  'es-ES':
    'Compra servidores o créditos de AI Hub en {{url}} — ingresa mi código de referencia "{{code}}" al pagar y obtén {{discount}}% de descuento.',
}

const SHARE_LABEL: Record<string, string> = {
  'en-US': 'Share',
  'zh-TW': '分享',
  'zh-CN': '分享',
  'ja-JP': 'シェア',
  'es-ES': 'Compartir',
}

const COPIED_LABEL: Record<string, string> = {
  'en-US': 'Copied',
  'zh-TW': '已複製',
  'zh-CN': '已复制',
  'ja-JP': 'コピーしました',
  'es-ES': 'Copiado',
}

/**
 * variant:
 *   - "toc": compact, rendered in the TOC sidebar (desktop only, hidden below xl)
 *   - "inline": rendered below main content (mobile only, hidden at xl+)
 * Mirrors FeedbackWidget's responsive split so the share button always sits
 * directly below the feedback widget on every viewport.
 */
export default function ShareButton({
  variant = 'toc',
}: {
  variant?: 'toc' | 'inline'
}) {
  const router = useRouter()
  const locale = router.locale || 'en-US'
  const { user, loading } = useZeaburAuth()
  const [copied, setCopied] = useState(false)

  if (loading || !user?.referralCode) return null

  const tmpl = SHARE_MESSAGES[locale] || SHARE_MESSAGES['en-US']
  const shareLabel = SHARE_LABEL[locale] || SHARE_LABEL['en-US']
  const copiedLabel = COPIED_LABEL[locale] || COPIED_LABEL['en-US']

  const handleShare = async () => {
    const pagePath = (router.asPath || '/').split(/[?#]/)[0]
    const shareUrl = `https://zeabur.com${pagePath}?referralCode=${user.referralCode}`
    const text = tmpl
      .replace('{{url}}', shareUrl)
      .replace('{{code}}', user.referralCode!)
      .replace('{{discount}}', String(DEFAULT_DISCOUNT))

    const willUseNativeShare =
      typeof navigator !== 'undefined' &&
      typeof navigator.share === 'function'

    captureShareButtonClicked({
      user_id: user._id,
      username: user.username,
      source_url: shareUrl.split(/[?#]/)[0],
      locale,
      share_method: willUseNativeShare ? 'native_share' : 'clipboard',
    })

    if (
      typeof navigator !== 'undefined' &&
      typeof navigator.share === 'function'
    ) {
      try {
        await navigator.share({ text, url: shareUrl })
        return
      } catch (err) {
        if ((err as { name?: string })?.name === 'AbortError') return
      }
    }

    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // browser without clipboard or share API — silently skip
    }
  }

  const visibilityClass =
    variant === 'inline' ? 'share-button-mobile-only' : ''

  return (
    <button
      type="button"
      className={`share-button ${visibilityClass} ${copied ? 'share-button-copied' : ''}`}
      onClick={handleShare}
      aria-label={shareLabel}
    >
      {copied ? (
        <>
          <CheckIcon />
          <span>{copiedLabel}</span>
        </>
      ) : (
        <>
          <ShareIcon />
          <span>{shareLabel}</span>
        </>
      )}
    </button>
  )
}

function ShareIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden
    >
      <path
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.7-10.3a.75.75 0 00-1.06-1.06L9 10.29 7.36 8.64a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.06 0l4.09-4.25z"
        fill="currentColor"
      />
    </svg>
  )
}
