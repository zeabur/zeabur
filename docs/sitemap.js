import fs from 'fs';
import path from 'path';

const baseUrl = "https://zeabur.com/docs";
const pagesDir = "./pages";
const publicDir = "./public";

// Marketplace templates from next.config.js
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
};

// Supported locales
const locales = ['en-US', 'zh-TW', 'zh-CN', 'ja-JP', 'es-ES'];

// Recursively get all .mdx files in a directory
const getFiles = (dir) => {
  let files = [];
  const items = fs.readdirSync(dir);
  for (let item of items) {
    const itemPath = path.join(dir, item);
    if (fs.statSync(itemPath).isDirectory()) {
      files = files.concat(getFiles(itemPath));
    } else if (item.endsWith(".mdx")) {
      files.push(itemPath);
    }
  }
  return files;
};

const files = getFiles(pagesDir);

// Create sitemap.xml
let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

// Add all pages from .mdx files
for (let file of files) {
  const fileName = path.basename(file);
  const pageName = fileName.split(".")[0];
  const fileDir = path.dirname(file);
  const url = `${baseUrl}${fileDir.replace(/^pages/, "")}${pageName === "index" ? "" : `/${pageName}`}`;
  sitemap += `  <url>\n    <loc>${url}</loc>\n  </url>\n`;
}

// Add marketplace URLs for all locales
for (let locale of locales) {
  for (let template of Object.keys(templateDocsMap)) {
    const url = `${baseUrl}/${locale}/marketplace/${template}`;
    sitemap += `  <url>\n    <loc>${url}</loc>\n  </url>\n`;
  }
}

sitemap += "</urlset>";

// Write sitemap.xml to public directory
fs.writeFileSync(path.join(publicDir, "sitemap.xml"), sitemap);
console.log("Sitemap generated!");
