//@ts-check

import React from 'react'
import { useConfig } from 'nextra-theme-docs'
import { useRouter } from 'nextra/hooks'
import WorkingInProgress from './components/WorkingInProgress'
import CreateProject from './components/CreateProject'
import LogoBlack from './public/logo_b.svg'
import LogoWhite from './public/logo_w.svg'

// base64 encoding that supports unicode strings
function base64Encode(str) {
  const buffer = Buffer.from(str, 'utf-8')
  return buffer.toString('base64')
}

/**
 * @type {import('nextra-theme-docs').DocsThemeConfig}
 */
const config = {
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
  logo: (
    <>
      <img
        src={LogoBlack.src}
        style={{ height: 20, objectFit: 'contain' }}
        alt="zeabur"
        className="black-logo"
      />
      <img
        src={LogoWhite.src}
        style={{ height: 20, objectFit: 'contain' }}
        alt="zeabur"
        className="white-logo"
      />
    </>
  ),
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
        <link href="/webmanifest" rel="manifest" />

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
