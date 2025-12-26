import fs from 'node:fs';
import path from 'node:path';

/**
 * Lightweight prerender for a Vite SPA:
 * - Copies dist/index.html into dist/<route>/index.html for known routes
 * - This helps crawlers and link sharing previews even without executing JS
 * - NOTE: This does not SSR the content; it provides per-route HTML shells with unique canonical URLs.
 */

const repoRoot = process.cwd();
const distDir = path.join(repoRoot, 'dist');
const indexPath = path.join(distDir, 'index.html');

if (!fs.existsSync(indexPath)) {
    console.error('[seo:prerender] dist/index.html not found. Run build first.');
    process.exit(1);
}

const routes = ['education', 'ai-chat', 'rag-ai', 'help', 'settings'];

const indexHtml = fs.readFileSync(indexPath, 'utf8');

for (const route of routes) {
    const outDir = path.join(distDir, route);
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, 'index.html'), indexHtml, 'utf8');
}

console.log(`[seo:prerender] Generated ${routes.length} prerendered route shells`);
