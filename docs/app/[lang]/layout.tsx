import { Layout, Navbar, Footer } from 'nextra-theme-docs'
import { getPageMap } from 'nextra/page-map'
import { LocaleProvider } from '../../components/locale-provider'
import { LocaleSwitcher } from '../../components/locale-switcher'
import { getDictionary } from '../../lib/i18n/dictionaries'
import { isRtl, localeNames } from '../../lib/i18n/locales'
import type { Locale } from '../../lib/i18n/locales'
import FeedbackWidget from '../../components/FeedbackWidget'
import '../globals.css'

// Build i18n config for Nextra Layout
const i18n = Object.entries(localeNames).map(([locale, name]) => ({
  locale,
  name,
  direction: isRtl(locale as Locale) ? ('rtl' as const) : ('ltr' as const),
}))

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const locale = lang as Locale
  const dictionary = await getDictionary(locale)
  const pageMap = await getPageMap(lang)

  return (
    <LocaleProvider locale={locale} dictionary={dictionary}>
      <Layout
        pageMap={pageMap}
        docsRepositoryBase="https://github.com/zeabur/zeabur/tree/main/docs"
        editLink={dictionary.nav.editLink}
        sidebar={{ defaultMenuCollapseLevel: 1 }}
        i18n={i18n}
        toc={{
          title: dictionary.nav.tocTitle,
          backToTop: dictionary.nav.backToTop,
          extraContent: <FeedbackWidget variant="toc" />,
        }}
        feedback={{
          content: dictionary.feedback.question,
        }}
        navbar={
          <Navbar
            logo={<span style={{ fontWeight: 700 }}>Zeabur</span>}
            projectLink="https://github.com/zeabur"
          />
        }
        footer={
          <Footer>
            <span>
              {new Date().getFullYear()} ©{' '}
              <a href="https://zeabur.com" target="_blank">
                Zeabur Pte. Ltd.
              </a>
            </span>
          </Footer>
        }
        color={{ hue: { dark: 278, light: 265 } }}
        search={{ placeholder: dictionary.nav.search }}
        main={({ children: mainChildren }) => (
          <>
            {mainChildren}
            <FeedbackWidget variant="inline" />
          </>
        )}
      >
        {children}
      </Layout>
    </LocaleProvider>
  )
}
