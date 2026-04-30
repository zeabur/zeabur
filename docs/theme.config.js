//@ts-check

import React from 'react'
import Link from 'next/link'
import { useConfig } from 'nextra-theme-docs'
import { useRouter } from 'nextra/hooks'
import WorkingInProgress from './components/WorkingInProgress'
import CreateProject from './components/CreateProject'
import LastUpdated from './components/LastUpdated'
import FeedbackWidget from './components/FeedbackWidget'
import LogoBlack from './public/logo_b.svg'
import LogoWhite from './public/logo_w.svg'
import IconBlack from './public/icon_b.svg'
import IconWhite from './public/icon_w.svg'

// base64 encoding that supports unicode strings
function base64Encode(str) {
  const buffer = Buffer.from(str, 'utf-8')
  return buffer.toString('base64')
}

// ── i18n helper ────────────────────────────────────────────────────
const t = {
  tocTitle:       { 'zh-TW': '目錄', 'zh-CN': '目录', 'ja-JP': '目次', 'es-ES': 'En esta página' },
  editLink:       { 'zh-TW': '編輯此頁面', 'zh-CN': '编辑此页面', 'ja-JP': 'このページを編集', 'es-ES': 'Editar esta página' },
  feedback:       { 'zh-TW': '有問題嗎？給我們回饋 →', 'zh-CN': '有问题？给我们反馈 →', 'ja-JP': 'フィードバックを送る →', 'es-ES': '¿Preguntas? Danos tu opinión →' },
  backToTop:      { 'zh-TW': '回到頂部', 'zh-CN': '回到顶部', 'ja-JP': 'トップに戻る', 'es-ES': 'Volver arriba' },
  searchPlaceholder: { 'zh-TW': '搜尋文件…', 'zh-CN': '搜索文档…', 'ja-JP': 'ドキュメントを検索…', 'es-ES': 'Buscar documentación…' },
}

/**
 * @type {import('nextra-theme-docs').DocsThemeConfig}
 */
const config = {
  gitTimestamp: null,
  project: {
    link: 'https://github.com/zeabur',
  },
  sidebar: {
    defaultMenuCollapseLevel: 1,
  },
  color: {
    hue: { dark: 278, light: 265 },
  },
  docsRepositoryBase: 'https://github.com/zeabur/zeabur/tree/main/docs',
  components: { WorkingInProgress, CreateProject },
  i18n: [
    { locale: 'en-US', name: 'English' },
    { locale: 'zh-TW', name: '繁體中文' },
    { locale: 'zh-CN', name: '简体中文' },
    { locale: 'ja-JP', name: '日本語' },
    { locale: 'es-ES', name: 'Español' },
  ],
  main: ({ children }) => {
    // Nextra renders an empty `<div class="_mt-16" />` as a placeholder where
    // the gitTimestamp would go (between MDX content and prev/next pagination).
    // Replace that slot with our <LastUpdated /> so the timestamp lands above
    // the pagination instead of after it.
    const kids = React.Children.toArray(children?.props?.children ?? children)
    const enhanced = kids.map((child) =>
      React.isValidElement(child) && child.props?.className === '_mt-16'
        ? <LastUpdated key="last-updated" />
        : child,
    )
    return (
      <>
        {enhanced}
        <FeedbackWidget variant="inline" />
      </>
    )
  },
  toc: {
    title: () => {
      const { locale } = useRouter()
      return t.tocTitle[locale] || 'On This Page'
    },
    backToTop: () => {
      const { locale } = useRouter()
      return t.backToTop[locale] || 'Scroll to top'
    },
    extraContent: () => <FeedbackWidget variant="toc" />,
  },
  editLink: {
    content: () => {
      const { locale } = useRouter()
      return t.editLink[locale] || 'Edit this page'
    },
  },
  feedback: {
    content: () => {
      const { locale } = useRouter()
      return t.feedback[locale] || 'Question? Give us feedback →'
    },
  },
  search: {
    placeholder: () => {
      const { locale } = useRouter()
      return t.searchPlaceholder[locale] || 'Search documentation…'
    },
  },

  navbar: {
    extraContent: (
      <>
        <a href="https://zeabur.com" target="_blank" className="nx-mr-4">
          Homepage
        </a>
        <a
          href="https://zeabur.com/projects"
          target="_blank"
          className="nx-mr-4"
        >
          Dashboard
        </a>
      </>
    ),
  },
  logoLink: false,
  logo: () => {
    const { locale } = useRouter()
    return (
      <Link href={`/${locale}`}>
        {/* Full wordmark — hidden on mobile */}
        <img src={LogoBlack.src} style={{ height: 20, objectFit: 'contain' }} alt="zeabur" className="black-logo logo-full" />
        <img src={LogoWhite.src} style={{ height: 20, objectFit: 'contain' }} alt="zeabur" className="white-logo logo-full" />
        {/* Z icon — visible on mobile only */}
        <img src={IconBlack.src} style={{ height: 22, objectFit: 'contain' }} alt="zeabur" className="black-logo logo-icon" />
        <img src={IconWhite.src} style={{ height: 22, objectFit: 'contain' }} alt="zeabur" className="white-logo logo-icon" />
      </Link>
    )
  },
  head: () => {
    const r = useRouter()
    const p = `${r.basePath}${r.pathname}`
    const { frontMatter } = useConfig()
    const ogEndpoint = 'https://og.zeabur.com/api/og'
    const ogQueryString = `title=${frontMatter.ogImageTitle}&desc=${frontMatter.ogImageSubtitle}`
    const encoded = base64Encode(ogQueryString)
    const ogUrl = `${ogEndpoint}/${encodeURIComponent(encoded)}.png`

    const title = frontMatter?.ogImageTitle + ' - Zeabur'
    const description =
      frontMatter?.description ||
      frontMatter.ogImageSubtitle ||
      'Zeabur: Deploy your service with one click.'

    return (
      <>
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="Content-Language" content="en" />

        <title>{title}</title>
        <meta property="og:title" content={title} />

        <meta name="description" content={description} />
        <meta property="og:description" content={description} />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:site:domain" content="zeabur.com" />
        <meta property="twitter:url" content={`https://zeabur.com${p}`} />
        <meta property="twitter:image" content={ogUrl} />

        <meta property="og:url" content={`https://zeabur.com${p}`} />
        <meta property="og:image" content={ogUrl} />

        <link rel="canonical" href={`https://zeabur.com${p}`} />

        <meta name="apple-mobile-web-app-title" content="Zeabur" />
        
        {/* PNG favicons as fallback for browsers that don't support SVG */}
        <link href="/favicon-32x32.png" rel="icon" type="image/png" sizes="32x32" />
        <link href="/favicon-16x16.png" rel="icon" type="image/png" sizes="16x16" />

        {/* SVG favicons for theme switching (modern browsers) */}
        <link href="/logo-dark.svg" rel="icon" type="image/svg+xml" className="favicon-dark" />
        <link href="/logo.svg" rel="icon" type="image/svg+xml" className ="favicon-light" />

        {/* Apple touch icon */}
        <link href="/apple-touch-icon.png" rel="apple-touch-icon" sizes="180x180" />

        {/* Web manifest */}
        <link href="/manifest.json" rel="manifest" />

        {/* Android Chrome icon */}
        <link href="/android-chrome-192x192.png" rel="mask-icon" />
        
        {/* Favicon controller for theme switching */}
        <script src="/docs/favicon-controller.js" />
      </>
    )
  },
  footer: {
    content: (
      <span>
        {new Date().getFullYear()} ©{' '}
        <a href="https://zeabur.com" target="_blank">
          Zeabur Pte. Ltd.
        </a>
      </span>
    ),
  },
}

export default config
