import {
  Geist,
  Noto_Sans_TC,
  Noto_Sans_SC,
  Noto_Sans_JP,
  JetBrains_Mono,
} from 'next/font/google'

export const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
  display: 'swap',
})

export const notoSansTC = Noto_Sans_TC({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-noto-tc',
  display: 'swap',
})

export const notoSansSC = Noto_Sans_SC({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-noto-sc',
  display: 'swap',
})

export const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-noto-jp',
  display: 'swap',
})

export const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const fontVariableClasses = [
  geist.variable,
  notoSansTC.variable,
  notoSansSC.variable,
  notoSansJP.variable,
  jetbrainsMono.variable,
].join(' ')
