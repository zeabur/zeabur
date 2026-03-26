import fs from 'fs'
import path from 'path'

const baseUrl = 'https://zeabur.com/docs'
const contentDir = './content'
const publicDir = './public'

// All supported locales
const locales = [
  'en-US', 'zh-TW', 'zh-CN', 'ja-JP', 'es-ES',
  'ko-KR', 'id-ID', 'th-TH', 'fr-FR', 'de-DE',
  'it-IT', 'ar-SA', 'pt-BR', 'vi-VN', 'hi-IN',
]
const defaultLocale = 'en-US'

// Marketplace templates from next.config.mjs
const templateDocsMap = {
  'dragonfly': 'UKMPPL',
  'flowise': '2JYZTR',
  'focalboard': 'SU7RTR',
  'ghost': 'SHEU50',
  'halo': 'Q6H2MA',
  'likit': 'KZOLHA',
  'linkwarden': '1E5ABT',
  'logto': 'AV1NZ4',
  'memos': 'KIJROJ',
  'mongodb': 'KXL04P',
  'mysql': 'DGLGRG',
  'n8n': 'W2H4RW',
  'postgresql': 'B20CX0',
  'rabbitmq': 'QAQWVO',
  'redis': 'KQZHXT',
  'rsshub': 'X46PTP',
  'ttrss': 'F1A1Y2',
  'umami': '01NQCC',
  'uptime-kuma': 'Q764RP',
  'wewe-rss': 'DI9BBD',
  'wordpress': 'CV344X',
}

// Recursively get all .mdx files in a directory
const getFiles = (dir) => {
  let files = []
  if (!fs.existsSync(dir)) return files
  const items = fs.readdirSync(dir)
  for (let item of items) {
    const itemPath = path.join(dir, item)
    if (fs.statSync(itemPath).isDirectory()) {
      files = files.concat(getFiles(itemPath))
    } else if (item.endsWith('.mdx')) {
      files.push(itemPath)
    }
  }
  return files
}

const files = getFiles(contentDir)

let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'

// Add all pages for each locale
for (const file of files) {
  const fileName = path.basename(file)
  const pageName = fileName.split('.')[0]
  const fileDir = path.dirname(file)
  const relativePath = fileDir.replace(/^content/, '') + (pageName === 'index' ? '' : `/${pageName}`)

  for (const locale of locales) {
    const prefix = locale === defaultLocale ? '' : `/${locale}`
    const url = `${baseUrl}${prefix}${relativePath}`
    sitemap += `  <url>\n    <loc>${url}</loc>\n  </url>\n`
  }
}

// Add marketplace URLs for all locales
for (const locale of locales) {
  for (const template of Object.keys(templateDocsMap)) {
    const prefix = locale === defaultLocale ? '' : `/${locale}`
    const url = `${baseUrl}${prefix}/marketplace/${template}`
    sitemap += `  <url>\n    <loc>${url}</loc>\n  </url>\n`
  }
}

sitemap += '</urlset>'

fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap)
console.log('Sitemap generated!')
