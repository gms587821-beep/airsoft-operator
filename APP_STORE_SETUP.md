# Airsoft HQ - App Store Setup Guide

Your app is now configured for both **PWA (Progressive Web App)** and **Native Mobile (iOS & Android)** distribution!

---

## ✅ What's Been Set Up

### PWA Configuration
- ✅ vite-plugin-pwa installed and configured
- ✅ PWA meta tags added to index.html
- ✅ Service worker auto-registration
- ✅ Offline support enabled
- ✅ Install page created at `/install`
- ✅ Manifest configured with app details

### Native Mobile (Capacitor) Configuration
- ✅ Capacitor dependencies installed
- ✅ capacitor.config.ts created
- ✅ Hot-reload configured for development
- ✅ App ID: app.lovable.81de8f362fd7480c9ee631a61b49552a

---

## 🎨 REQUIRED: Add PWA Icons

**You must add these icon files to the `public/` folder:**

1. **pwa-192x192.png** (192x192 pixels)
2. **pwa-512x512.png** (512x512 pixels)

These should be your Airsoft HQ logo/icon with:
- Square format
- Transparent or solid background
- High contrast tactical design
- Professional appearance

**Tip:** Use a tool like [Figma](https://figma.com), [Canva](https://canva.com), or [RealFaviconGenerator](https://realfavicongenerator.net) to create these icons.

---

## 🌐 PWA Deployment (Free & Instant)

Your PWA is **ready to deploy right now**!

### How Users Install:

**On iPhone/iPad:**
1. Open Airsoft HQ in Safari
2. Tap the Share button (box with arrow)
3. Scroll down and tap "Add to Home Screen"
4. Tap "Add"

**On Android:**
1. Open Airsoft HQ in Chrome
2. Tap the menu (three dots)
3. Tap "Install App" or "Add to Home Screen"
4. Tap "Install"

**Or use the Install Page:**
- Direct users to `yourdomain.com/install`
- They can click the "Install" button for guided setup

### Publishing Your PWA:
1. Deploy to your production URL (already done via Lovable)
2. Users visit your site and install from browser
3. That's it! No app store approval needed.

---

## 📱 Native Mobile Deployment (iOS & Android App Stores)

### Prerequisites:
- **Mac with Xcode** (for iOS development)
- **Android Studio** (for Android development)
- **Apple Developer Account** ($99/year) - for iOS App Store
- **Google Play Console Account** ($25 one-time) - for Google Play Store

### Step 1: Export to GitHub
1. In Lovable, click "Export to GitHub" button
2. Clone your repository to your local machine:
   ```bash
   git clone https://github.com/yourusername/airsoft-hq.git
   cd airsoft-hq
   ```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Build Your Web App
```bash
npm run build
```

### Step 4: Add Native Platforms

**For iOS:**
```bash
npx cap add ios
npx cap update ios
npx cap sync ios
```

**For Android:**
```bash
npx cap add android
npx cap update android
npx cap sync android
```

### Step 5: Update capacitor.config.ts for Production

Before building for stores, update `capacitor.config.ts`:

```typescript
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.81de8f362fd7480c9ee631a61b49552a',
  appName: 'Airsoft HQ',
  webDir: 'dist',
  // Remove or comment out the server config for production:
  // server: {
  //   url: '...',
  //   cleartext: true
  // }
};

export default config;
```

### Step 6: Open in Native IDEs

**iOS (requires Mac):**
```bash
npx cap open ios
```
- Opens in Xcode
- Set up signing & capabilities
- Configure app icon & splash screens
- Build for device/simulator

**Android:**
```bash
npx cap open android
```
- Opens in Android Studio
- Set up app icon & splash screens
- Configure build variants
- Build APK/AAB for Play Store

### Step 7: After Making Changes

Whenever you update your code:
```bash
npm run build
npx cap sync
```

### Step 8: Submit to Stores

**iOS App Store:**
1. In Xcode: Product → Archive
2. Upload to App Store Connect
3. Fill in app details, screenshots, description
4. Submit for review (typically 1-3 days)

**Google Play Store:**
1. In Android Studio: Build → Generate Signed Bundle/APK
2. Upload to Google Play Console
3. Fill in store listing, screenshots, description
4. Submit for review (typically 1-3 days)

---

## 🔧 Hot Reload During Development

The Capacitor config includes hot-reload support. When testing on device/emulator:
1. Make sure the device is on the same network
2. Run the app from Xcode/Android Studio
3. Changes in Lovable will reflect immediately

---

## 📝 App Store Requirements Checklist

### Required for Both Stores:
- ✅ App icons (done via IDE)
- ✅ Splash screens (done via IDE)
- ⚠️ Privacy policy URL (create one)
- ⚠️ Terms of service URL (create one)
- ⚠️ App screenshots (5-8 per device size)
- ⚠️ App description (compelling, keyword-optimized)
- ⚠️ App preview video (recommended)

### iOS Specific:
- Apple Developer account ($99/year)
- App Store Connect listing
- TestFlight beta testing (recommended)
- Review guidelines compliance

### Android Specific:
- Google Play Console account ($25 one-time)
- Content rating questionnaire
- Target API level compliance
- 64-bit support (automatic with Capacitor)

---

## 🚀 Recommended Next Steps

1. **Immediate (PWA):**
   - Add PWA icons to `public/` folder
   - Deploy and test PWA install flow
   - Share install page with beta users

2. **Within 1 Week (Native Prep):**
   - Export to GitHub
   - Set up development environment (Xcode/Android Studio)
   - Add native platforms and test locally
   - Create privacy policy and terms of service

3. **Within 2-4 Weeks (Store Submission):**
   - Design app store assets (screenshots, preview video)
   - Write compelling store descriptions
   - Submit to both app stores
   - Plan launch marketing

---

## 💡 Pro Tips

- **Start with PWA** to get users quickly while app stores review
- **Beta test** with TestFlight (iOS) and Internal Testing (Android) first
- **Use analytics** to track adoption and user behavior
- **Update regularly** - both stores favor actively maintained apps
- **Optimize store listing** with keywords and quality screenshots
- **Cross-promote** between PWA and native apps

---

## 🆘 Need Help?

- **PWA Issues:** Check browser console and Application tab
- **Capacitor Issues:** [Official Capacitor Docs](https://capacitorjs.com/docs)
- **iOS App Store:** [Apple Developer Documentation](https://developer.apple.com)
- **Google Play Store:** [Google Play Console Help](https://support.google.com/googleplay/android-developer)

---

## 📧 Support

If you encounter issues during setup, check:
1. [Lovable Capacitor Documentation](https://docs.lovable.dev/features/mobile-apps)
2. [Capacitor Community Discord](https://discord.com/invite/UPYYRhtyzp)
3. Your project's GitHub Issues

---

**Good luck with your app store launch! 🎯**
