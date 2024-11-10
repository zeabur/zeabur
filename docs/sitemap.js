import fs from 'fs';
import path from 'path';

const baseUrl = "https://zeabur.com/docs";
const pagesDir = "./pages";
const publicDir = "./public";

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
for (let file of files) {
  const fileName = path.basename(file);
  const pageName = fileName.split(".")[0];
  const fileDir = path.dirname(file);
  const url = baseUrl + fileDir.replace(/^pages/, "") + "/" + pageName;
  sitemap += `  <url>\n    <loc>${url}</loc>\n  </url>\n`;
}
sitemap += "</urlset>";

// Write sitemap.xml to public directory
fs.writeFileSync(path.join(publicDir, "sitemap.xml"), sitemap);
console.log("Sitemap generated!");
