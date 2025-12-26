import fs from 'node:fs';
import path from 'node:path';

/**
 * Simple sitemap generator for this Vite SPA.
 * - Writes dist/sitemap.xml at build time
 * - Requires VITE_SITE_URL in env for correct absolute URLs
 */

const repoRoot = process.cwd();
const distDir = path.join(repoRoot, 'dist');

if (!fs.existsSync(distDir)) {
    console.error('[seo:sitemap] dist/ not found. Run build first.');
    process.exit(1);
}

const siteUrl = process.env.VITE_SITE_URL || process.env.SITE_URL;
if (!siteUrl) {
    console.warn('[seo:sitemap] Missing VITE_SITE_URL (or SITE_URL). sitemap.xml will not be generated.');
    process.exit(0);
}

const base = siteUrl.replace(/\/+$/, '');

// Keep this list synced with Seo tab paths in App.tsx / prerender routes.
const routes = ['/', '/education', '/ai-chat', '/rag-ai', '/help', '/settings'];

const now = new Date().toISOString();

const urlEntries = routes
    .map((r) => {
        const loc = `${base}${r}`;
        return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${r === '/' ? '1.0' : '0.7'}</priority>\n  </url>`;
    })
    .join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>
`;

fs.writeFileSync(path.join(distDir, 'sitemap.xml'), xml, 'utf8');
console.log(`[seo:sitemap] Wrote dist/sitemap.xml with ${routes.length} routes`);

// Optional: ensure robots.txt exists in dist and points to sitemap
const robotsPath = path.join(distDir, 'robots.txt');
const robots = `User-agent: *
Allow: /

Sitemap: ${base}/sitemap.xml
`;
fs.writeFileSync(robotsPath, robots, 'utf8');
console.log('[seo:sitemap] Wrote dist/robots.txt');
