import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 1. Auto-updating sitemap.xml...');
try {
  await import('./scripts/generate-sitemap.mjs');
} catch (sitemapErr) {
  console.warn('Sitemap script warning:', sitemapErr);
}

console.log('🏗️ 2. Running Astro build...');
try {
  const nodeExe = process.execPath;
  const astroBin = path.join(__dirname, 'node_modules', 'astro', 'astro.js');
  execSync(`"${nodeExe}" "${astroBin}" build`, { stdio: 'inherit', cwd: __dirname });
  console.log('✅ Astro build finished successfully!');

  // Sync dist/index.html to root index.html with relative paths for local file previews
  const distIndexPath = path.join(__dirname, 'dist', 'index.html');
  const rootIndexPath = path.join(__dirname, 'index.html');
  if (fs.existsSync(distIndexPath)) {
    let htmlContent = fs.readFileSync(distIndexPath, 'utf8');
    // Ensure relative paths for _astro so double-clicking index.html works locally
    htmlContent = htmlContent.replace(/href="\/_astro\//g, 'href="./_astro/');
    htmlContent = htmlContent.replace(/src="\/_astro\//g, 'src="./_astro/');
    htmlContent = htmlContent.replace(/src="\/images\//g, 'src="./images/');
    fs.writeFileSync(rootIndexPath, htmlContent, 'utf8');
    fs.writeFileSync(distIndexPath, htmlContent, 'utf8');
    console.log('✅ Synchronized and localized dist/index.html to root index.html for instant static preview');
  }

  // Sync dist/_astro to root _astro
  const distAstroDir = path.join(__dirname, 'dist', '_astro');
  const rootAstroDir = path.join(__dirname, '_astro');
  if (fs.existsSync(distAstroDir)) {
    if (!fs.existsSync(rootAstroDir)) fs.mkdirSync(rootAstroDir, { recursive: true });
    for (const f of fs.readdirSync(distAstroDir)) {
      fs.copyFileSync(path.join(distAstroDir, f), path.join(rootAstroDir, f));
    }
    console.log('✅ Synchronized _astro assets to root _astro');
  }

  // Sync css to dist/css
  const rootCssDir = path.join(__dirname, 'css');
  const distCssDir = path.join(__dirname, 'dist', 'css');
  if (fs.existsSync(rootCssDir)) {
    if (!fs.existsSync(distCssDir)) fs.mkdirSync(distCssDir, { recursive: true });
    for (const f of fs.readdirSync(rootCssDir)) {
      fs.copyFileSync(path.join(rootCssDir, f), path.join(distCssDir, f));
    }
  }

  // Sync public/js to dist/js and root js
  const publicJsDir = path.join(__dirname, 'public', 'js');
  const distJsDir = path.join(__dirname, 'dist', 'js');
  const rootJsDir = path.join(__dirname, 'js');
  if (fs.existsSync(publicJsDir)) {
    if (!fs.existsSync(distJsDir)) fs.mkdirSync(distJsDir, { recursive: true });
    if (!fs.existsSync(rootJsDir)) fs.mkdirSync(rootJsDir, { recursive: true });
    for (const f of fs.readdirSync(publicJsDir)) {
      fs.copyFileSync(path.join(publicJsDir, f), path.join(distJsDir, f));
      fs.copyFileSync(path.join(publicJsDir, f), path.join(rootJsDir, f));
    }
  }

  // Sync public/images to dist/images and root images
  const publicImagesDir = path.join(__dirname, 'public', 'images');
  const distImagesDir = path.join(__dirname, 'dist', 'images');
  const rootImagesDir = path.join(__dirname, 'images');
  if (fs.existsSync(publicImagesDir)) {
    if (!fs.existsSync(distImagesDir)) fs.mkdirSync(distImagesDir, { recursive: true });
    if (!fs.existsSync(rootImagesDir)) fs.mkdirSync(rootImagesDir, { recursive: true });
    for (const f of fs.readdirSync(publicImagesDir)) {
      fs.copyFileSync(path.join(publicImagesDir, f), path.join(distImagesDir, f));
      fs.copyFileSync(path.join(publicImagesDir, f), path.join(rootImagesDir, f));
    }
  }

  // Ensure public files like robots.txt, llms.txt, sitemap.xml are in dist
  const publicFiles = ['robots.txt', 'llms.txt', 'llms-full.txt', 'sitemap.xml', 'favicon.svg', '.nojekyll'];
  for (const file of publicFiles) {
    const src = path.join(__dirname, 'public', file);
    const dest = path.join(__dirname, 'dist', file);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
    }
  }
  process.exit(0);
} catch (err) {
  console.error('❌ Build error:', err);
  process.exit(1);
}
