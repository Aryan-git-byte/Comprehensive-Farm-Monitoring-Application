# 🚀 PWA Quick Reference

## Development

```bash
# Install dependencies
npm install

# Run dev server (PWA enabled)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Testing PWA

### Desktop
- Open in Chrome/Edge
- Look for install icon (⊕) in address bar
- Click to install

### Mobile
- Open in Chrome (Android) or Safari (iOS)
- Tap "Install" prompt or use Share menu
- Add to home screen

### Offline Test
1. Open DevTools (F12)
2. Network tab → Check "Offline"
3. Reload → App should work!

## Lighthouse Audit

1. DevTools (F12) → Lighthouse tab
2. Check "Progressive Web App"
3. Generate report
4. Target: 95+ score

## Key Files

```
vite.config.js          # PWA configuration
public/manifest.json    # App metadata
public/icons/           # App icons
src/main.tsx           # Service worker registration
PWA_GUIDE.md           # Full documentation
```

## Caching

| Resource | Strategy | Duration |
|----------|----------|----------|
| Static (HTML/CSS/JS) | CacheFirst | Forever |
| Weather API | CacheFirst | 24h |
| AI API | NetworkFirst | 1h |
| Supabase | NetworkFirst | 1h |

## Required Icons

Need PNG icons in these sizes:
- 72x72, 96x96, 128x128, 144x144
- 152x152, 192x192, 384x384, 512x512

**Generate at**: https://www.pwabuilder.com/imageGenerator

## Deployment Checklist

- [ ] Generate all icon sizes
- [ ] Build production version: `npm run build`
- [ ] Test offline functionality
- [ ] Run Lighthouse audit (95+ score)
- [ ] Deploy to HTTPS hosting
- [ ] Test on real devices
- [ ] Verify installation works

## Quick Fixes

**Icons not showing?**
```bash
# Generate from SVG
magick convert icon-512x512.svg -resize 192x192 icon-192x192.png
```

**Service Worker not registering?**
```bash
# Clear cache and rebuild
npm run build
# Clear browser cache (Ctrl+Shift+Delete)
```

**Offline not working?**
- Check Service Worker in DevTools → Application
- Verify caching in Network tab
- Check console for errors

## Support

📖 Full Guide: `PWA_GUIDE.md`
🛠️ Implementation: `PWA_IMPLEMENTATION_SUMMARY.md`
❓ Issues: Check browser console + documentation

---

**🎉 Your app is now a PWA!**
