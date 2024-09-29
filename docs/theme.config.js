//@ts-check

import React from 'react';
import { Callout } from 'nextra/components'
import { useConfig } from 'nextra-theme-docs'
import { useRouter } from 'next/router'
import WorkingInProgress from './components/WorkingInProgress'
import CreateProject from './components/CreateProject'
import LogoBlack from './public/logo_b.svg'
import LogoWhite from './public/logo_w.svg'

// base64 encoding that supports unicode strings
function base64Encode(str) {
  const buffer = Buffer.from(str, 'utf-8')
  return buffer.toString('base64')
}

export default {
  project: {
    link: 'https://github.com/zeabur',
  },
  sidebar: {
    defaultMenuCollapseLevel: 1,
  },
  primaryHue: { dark: 278, light: 265 },
  docsRepositoryBase: 'https://github.com/zeabur/zeabur/tree/main/docs',
  components: { WorkingInProgress, CreateProject, Callout },
  i18n: [
    { locale: 'en-US', text: 'English' },
    { locale: 'zh-TW', text: '繁體中文' },
    { locale: 'zh-CN', text: '简体中文' },
    { locale: 'ja-JP', text: '日本語' },
    { locale: 'es-ES', text: 'Español' },
  ],
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
  useNextSeoProps() {
    return {
      titleTemplate: '%s – Zeabur',
    }
  },
  head: () => {
    const r = useRouter()
    const p =
      r.basePath +
      (r.locale === 'en-US' ? '' : '/' + r.locale) +
      r.asPath.replace('.' + r.locale, '')
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
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/android-chrome-192x192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
      </>
    )
  },
  footer: {
    text: (
      <span>
        {new Date().getFullYear()} ©{' '}
        <a href="https://zeabur.com" target="_blank">
          Zeabur Pte. Ltd.
        </a>
        .
      </span>
    ),
  },
}
