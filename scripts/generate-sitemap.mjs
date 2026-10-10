import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const publicSitemapPath = path.join(rootDir, 'public', 'sitemap.xml');
const distSitemapPath = path.join(rootDir, 'dist', 'sitemap.xml');

const today = new Date().toISOString().split('T')[0];

const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>https://royalhairandbeautysalon.com/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="pt" href="https://royalhairandbeautysalon.com/" />
    <xhtml:link rel="alternate" hreflang="pt-PT" href="https://royalhairandbeautysalon.com/" />
    <xhtml:link rel="alternate" hreflang="en" href="https://royalhairandbeautysalon.com/" />
    <xhtml:link rel="alternate" hreflang="x-default" href="https://royalhairandbeautysalon.com/" />
  </url>
</urlset>
`;

// Write to public/
fs.writeFileSync(publicSitemapPath, sitemapContent, 'utf-8');
console.log(`✅ sitemap.xml automatically updated with date: ${today} in public/`);

// Write to dist/ if dist exists
if (fs.existsSync(path.join(rootDir, 'dist'))) {
  fs.writeFileSync(distSitemapPath, sitemapContent, 'utf-8');
  console.log(`✅ sitemap.xml automatically synced to dist/`);
}
