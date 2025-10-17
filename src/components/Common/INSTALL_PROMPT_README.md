# Install Prompt Component

## Overview

The `InstallPrompt` component provides a user-friendly way to prompt users to install your PWA. It automatically appears after 30 seconds and handles the installation flow.

## Features

- ✅ Automatic display after 30 seconds
- ✅ Dismissable (reappears after 24 hours if dismissed)
- ✅ Detects if app is already installed
- ✅ Responsive design (mobile & desktop)
- ✅ Dark mode support
- ✅ Smooth animations

## Usage

### Option 1: Add to App.tsx (Recommended)

Add the component at the root level of your app:

```tsx
import { InstallPrompt } from './components/Common/InstallPrompt';

function App() {
  return (
    <>
      <Router>
        {/* Your routes */}
      </Router>
      
      {/* Add this at the end */}
      <InstallPrompt />
    </>
  );
}
```

### Option 2: Add to specific pages

Import and use in any component:

```tsx
import { InstallPrompt } from '../components/Common/InstallPrompt';

function Dashboard() {
  return (
    <div>
      {/* Your dashboard content */}
      <InstallPrompt />
    </div>
  );
}
```

## Customization

### Change timing

Edit line 24 in `InstallPrompt.tsx`:

```tsx
// Show after 30 seconds (default)
setTimeout(() => setShowPrompt(true), 30000);

// Change to 10 seconds
setTimeout(() => setShowPrompt(true), 10000);

// Or show immediately
setShowPrompt(true);
```

### Change dismiss duration

Edit line 63 in `InstallPrompt.tsx`:

```tsx
// Reappear after 24 hours (default)
setTimeout(() => setShowPrompt(true), 86400000);

// Change to 1 hour
setTimeout(() => setShowPrompt(true), 3600000);
```

### Styling

The component uses Tailwind CSS. Customize colors and styles as needed:

```tsx
// Current green theme
bg-green-600 hover:bg-green-700

// Change to blue
bg-blue-600 hover:bg-blue-700

// Change to custom color
bg-[#your-color] hover:bg-[#your-hover-color]
```

## Browser Support

The install prompt works on:
- ✅ Chrome/Edge (Android & Desktop)
- ✅ Samsung Internet (Android)
- ⚠️ Safari (iOS) - Uses "Add to Home Screen" instead
- ⚠️ Firefox - Limited support

## Testing

### Test on Desktop (Chrome/Edge):
1. Run `npm run dev`
2. Open in Chrome/Edge
3. Wait 30 seconds (or change timing to show immediately)
4. Click "Install App"
5. Verify app installs

### Test on Mobile (Chrome/Edge):
1. Deploy to HTTPS server (or use ngrok for local testing)
2. Open on mobile device
3. Wait for prompt or trigger manually
4. Install and test

### Test Installed State:
1. Install the app
2. Open installed app
3. Verify prompt doesn't show (it detects standalone mode)

## Analytics (Optional)

Track install events:

```tsx
const handleInstallClick = async () => {
  if (!deferredPrompt) return;

  // Track install attempt
  if (window.gtag) {
    window.gtag('event', 'pwa_install_attempted');
  }

  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;

  // Track install outcome
  if (window.gtag) {
    window.gtag('event', outcome === 'accepted' ? 'pwa_installed' : 'pwa_dismissed');
  }

  setDeferredPrompt(null);
  setShowPrompt(false);
};
```

## Troubleshooting

### Prompt not showing
- Check browser console for errors
- Ensure you're using HTTPS (or localhost)
- Verify manifest.json is accessible
- Check if all PWA criteria are met (Lighthouse audit)

### Prompt shows on installed app
- Component checks `display-mode: standalone`
- Ensure this media query is supported in your browser
- Add additional checks if needed

### Styling issues
- Verify Tailwind CSS is properly configured
- Check dark mode setup
- Test responsive breakpoints

## Advanced: Manual Install Button

Create a manual install button anywhere in your app:

```tsx
import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';

export const InstallButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  };

  if (isInstalled || !deferredPrompt) return null;

  return (
    <button
      onClick={handleInstall}
      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
    >
      <Download className="w-4 h-4" />
      Install App
    </button>
  );
};
```

## Resources

- [MDN: beforeinstallprompt](https://developer.mozilla.org/en-US/docs/Web/API/BeforeInstallPromptEvent)
- [Web.dev: Install Prompt](https://web.dev/customize-install/)
- [PWA Install Patterns](https://web.dev/promoting-install-mobile/)
