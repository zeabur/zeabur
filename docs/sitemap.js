import fs from 'fs';
import path from 'path';

const baseUrl = "https://zeabur.com/docs";
const pagesDir = "./pages";
const publicDir = "./public";

// Supported locales
const locales = ['en-US', 'zh-TW', 'zh-CN', 'ja-JP', 'es-ES'];

// Build a set of redirect source paths from next.config.js so the sitemap
// never advertises URLs that just redirect — Google should discover the
// canonical destination directly.
async function getRedirectSources() {
  const configModule = await import('./next.config.js');
  const config = configModule.default;
  const redirects = typeof config.redirects === 'function'
    ? await config.redirects()
    : [];

  const sources = new Set();
  for (const rule of redirects) {
    // Convert Next.js patterns like /:locale/billing/plans to a regex.
    // Replace :locale with each real locale, :path* with .+
    const pattern = rule.source;

    if (pattern.includes(':locale')) {
      for (const locale of locales) {
        const concrete = pattern
          .replace(':locale', locale)
          .replace(/:path\*/g, '.+');
        sources.add(concrete);
      }
    } else {
      const concrete = pattern.replace(/:path\*/g, '.+');
      sources.add(concrete);
    }
  }

  return sources;
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Check if a docs-relative path (e.g. /en-US/billing/plans) is a redirect source
function isRedirected(docsPath, redirectSources) {
  for (const pattern of redirectSources) {
    if (pattern.includes('.+')) {
      const escaped = pattern.split('.+').map(escapeRegex).join('.+');
      const re = new RegExp(`^${escaped}$`);
      if (re.test(docsPath)) return true;
    } else if (docsPath === pattern) {
      return true;
    }
  }
  return false;
}

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

const redirectSources = await getRedirectSources();
const files = getFiles(pagesDir);

let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

let included = 0;
let excluded = 0;

for (let file of files) {
  const fileName = path.basename(file);
  const pageName = fileName.split(".")[0];
  const fileDir = path.dirname(file);
  const docsPath = `${fileDir.replace(/^pages/, "")}${pageName === "index" ? "" : `/${pageName}`}`;

  if (isRedirected(docsPath, redirectSources)) {
    excluded++;
    continue;
  }

  sitemap += `  <url>\n    <loc>${baseUrl}${docsPath}</loc>\n  </url>\n`;
  included++;
}

sitemap += "</urlset>";

fs.writeFileSync(path.join(publicDir, "sitemap.xml"), sitemap);
console.log(`Sitemap generated! ${included} URLs included, ${excluded} redirect sources excluded.`);
