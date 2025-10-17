# 📱 Progressive Web App (PWA) Guide

## What is a PWA?

A Progressive Web App (PWA) is a web application that can be installed on devices and work offline, providing an app-like experience. This Farm Monitoring Application is now a fully-featured PWA!

## ✨ PWA Features

### 🚀 Installable
- Install directly from your browser
- Works on Android, iOS, Windows, macOS, Linux
- No app store required
- Takes up minimal storage space

### 📴 Offline Support
- Works without internet connection
- Cached data available offline
- Automatic sync when connection restored
- Weather & sensor data cached for 24 hours

### ⚡ Performance
- Lightning-fast loading
- Automatic updates
- Optimized caching strategies
- Background sync capability

### 🔔 Native Features
- Push notifications (coming soon)
- Home screen icon
- Full-screen experience
- Native app feel

## 📲 Installation Instructions

### On Android (Chrome/Edge)

1. **Open the app** in Chrome or Edge browser
2. Look for the **"Install"** prompt at the bottom or top of the screen
3. Tap **"Install"** or **"Add to Home Screen"**
4. Confirm installation
5. Find the app icon on your home screen

**Alternative Method:**
1. Tap the **three-dot menu** (⋮) in the browser
2. Select **"Install app"** or **"Add to Home Screen"**
3. Confirm and launch

### On iOS (Safari)

1. **Open the app** in Safari browser
2. Tap the **Share button** (□↑) at the bottom
3. Scroll down and tap **"Add to Home Screen"**
4. Edit the name if desired
5. Tap **"Add"**
6. Find the app icon on your home screen

**Note:** iOS currently has limited PWA features, but basic offline functionality works.

### On Windows (Chrome/Edge)

1. **Open the app** in Chrome or Edge
2. Look for the **install icon** (⊕) in the address bar
3. Click **"Install"**
4. The app opens in its own window
5. Find it in your Start Menu

**Alternative Method:**
1. Click the **three-dot menu** (⋮)
2. Select **"Install [App Name]"**
3. Confirm installation

### On macOS (Chrome/Safari)

1. **Open the app** in Chrome or Safari
2. Click the **install icon** in the address bar (Chrome)
3. Or use Safari's **"Add to Dock"** feature
4. Confirm installation
5. Access from Launchpad or Dock

### On Linux (Chrome/Firefox)

1. **Open the app** in Chrome or Firefox
2. Click the **three-dot menu**
3. Select **"Install"** or **"Create shortcut"**
4. Choose **"Open as window"**
5. Access from applications menu

## 🔧 Developer Setup

### Prerequisites

Make sure you have the following installed:
- Node.js >= 16.x
- npm or yarn

### Installation

The PWA plugin is already configured. Just run:

```bash
npm install
```

### Development with PWA

```bash
npm run dev
```

The PWA features are enabled in development mode, so you can test:
- Service Worker registration
- Offline functionality
- Caching strategies
- Install prompts

### Building for Production

```bash
npm run build
```

This generates:
- Optimized production build
- Service Worker file
- Web App Manifest
- Pre-cached assets

### Preview Production Build

```bash
npm run preview
```

Test the production build locally with full PWA features.

## 🎯 PWA Configuration

### Caching Strategies

#### 1. **Static Assets** (CacheFirst)
- HTML, CSS, JavaScript
- Images, fonts
- Icons

#### 2. **Weather API** (CacheFirst)
- OpenWeather API responses
- Cached for 24 hours
- Falls back to network if stale

#### 3. **AI API** (NetworkFirst)
- OpenRouter AI responses
- 10-second network timeout
- Falls back to cache
- Cached for 1 hour

#### 4. **Supabase** (NetworkFirst)
- Database queries
- Cached for 1 hour
- Prioritizes fresh data

### Service Worker Features

- **Automatic Updates**: App updates automatically
- **Skip Waiting**: New versions activate immediately
- **Clean Old Caches**: Removes outdated cached data
- **Background Sync**: Syncs data when connection restored (coming soon)

## 📊 Offline Capabilities

### What Works Offline:

✅ **Full UI Navigation**
- All pages accessible
- Navigation fully functional
- Settings persist

✅ **Cached Data**
- Last fetched weather data
- Recent AI conversations
- Sensor readings (if cached)

✅ **Manual Entry**
- Add data offline
- Syncs when online

✅ **Settings**
- Change language
- Update preferences
- All stored locally

### What Requires Internet:

❌ Real-time weather updates
❌ New AI queries
❌ Fresh sensor data
❌ User authentication (first time)

## 🔔 Notifications (Coming Soon)

Future PWA features will include:
- Weather alerts
- Sensor threshold notifications
- AI advice reminders
- Update notifications

## 🎨 App Icons

The PWA includes optimized icons for all platforms:

| Size | Purpose |
|------|---------|
| 72x72 | Small devices |
| 96x96 | Standard mobile |
| 128x128 | Tablets |
| 144x144 | Windows tiles |
| 152x152 | iOS devices |
| 192x192 | Android Chrome |
| 384x384 | High-res displays |
| 512x512 | Splash screens |
| 512x512 (maskable) | Android adaptive icons |

### Generating Custom Icons

To use your own logo:

1. Create a 512x512 PNG image
2. Visit https://www.pwabuilder.com/imageGenerator
3. Upload your image
4. Download the generated icon pack
5. Replace files in `public/icons/`

## 🧪 Testing PWA Features

### Chrome DevTools

1. Open **DevTools** (F12)
2. Go to **Application** tab
3. Check:
   - **Manifest**: View app manifest
   - **Service Workers**: Check registration
   - **Cache Storage**: Inspect cached data
   - **Storage**: View local data

### Lighthouse Audit

1. Open **DevTools** (F12)
2. Go to **Lighthouse** tab
3. Select **Progressive Web App**
4. Click **Generate report**
5. Review PWA score and recommendations

### Testing Offline

1. Open **DevTools** (F12)
2. Go to **Network** tab
3. Check **"Offline"** checkbox
4. Reload page and test functionality

## 🚀 Deployment

### Vercel (Recommended)

```bash
vercel deploy --prod
```

Vercel automatically detects PWA features and serves them correctly.

### Netlify

```bash
netlify deploy --prod
```

Add to `netlify.toml`:
```toml
[[headers]]
  for = "/sw.js"
  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"

[[headers]]
  for = "/manifest.json"
  [headers.values]
    Content-Type = "application/manifest+json"
```

### HTTPS Required

PWA features require HTTPS. Most hosting platforms provide this by default.

## 📱 App Updates

### How Updates Work

1. User opens the app
2. Service Worker checks for updates
3. New version downloads in background
4. User is prompted: "New content available. Reload to update?"
5. User confirms and app updates

### Manual Update Check

Users can force-check for updates by:
1. Closing all app tabs/windows
2. Reopening the app
3. Service Worker will detect and install updates

## 🐛 Troubleshooting

### App Won't Install

**Solution:**
- Ensure you're using HTTPS (not localhost in production)
- Clear browser cache
- Check if manifest.json is accessible
- Verify all icon files exist

### Offline Mode Not Working

**Solution:**
- Check Service Worker registration in DevTools
- Clear Service Worker and re-register
- Ensure `navigator.serviceWorker` is supported
- Check browser console for errors

### Icons Not Showing

**Solution:**
- Generate all required icon sizes
- Check file paths in manifest.json
- Clear browser cache
- Verify icons are in `public/icons/` folder

### Service Worker Errors

**Solution:**
- Check browser console for errors
- Unregister old Service Workers
- Clear cache storage
- Rebuild the app: `npm run build`

## 📚 Resources

- [PWA Documentation](https://web.dev/progressive-web-apps/)
- [Workbox Guide](https://developer.chrome.com/docs/workbox/)
- [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

## 🎉 Benefits of PWA

### For Users:
- ✅ Fast loading times
- ✅ Works offline
- ✅ App-like experience
- ✅ No app store hassle
- ✅ Automatic updates
- ✅ Less storage space

### For Developers:
- ✅ Single codebase
- ✅ Cross-platform
- ✅ No app store approval
- ✅ Instant updates
- ✅ Better engagement
- ✅ Lower maintenance

---

**Enjoy your Progressive Web App experience! 🎊**

For issues or questions, please open an issue on GitHub.
