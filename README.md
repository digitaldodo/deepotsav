# 🪔 Deepotsav — Premium Mobile-First Diwali Gifting Platform

[![Next.js](https://img.shields.io/badge/Next.js-16.4.5-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-gold.svg)](https://opensource.org/licenses/MIT)

**Deepotsav** is a premium, mobile-first, highly interactive digital Diwali celebration and greeting platform. It enables anyone to design, personalize, and share an immersive celebration experience for loved ones, friends, and colleagues.

Recipients open your customized experience directly in their mobile browser—**no app installation, account creation, or login required**.

---

## ✨ Key Features

### 1. 📱 Designed Mobile-First for Smartphones
- **Optimized for 360px–430px viewports** (Android Chrome, Samsung Internet, iOS Safari).
- **Touch-friendly design**: large >44px touch targets, comfortable thumb ergonomics.
- **Zero horizontal scroll**: fluid responsive layouts across smartphones, foldables, tablets, and desktops.
- **PWA-Ready**: Standalone installability, web app manifest, and offline-resilient local architecture.

### 2. 🪔 Six Distinct Artistic Diwali Templates
Each design has its own unique layout, ornamentation, and festive mood:
1. **Royal Gold**: Midnight navy background, regal gold mandalas, traditional brass motifs, glowing diyas.
2. **Traditional Rangoli**: Warm terracotta and marigold palettes, floral toran garlands, vibrant kolam patterns.
3. **Minimal Luxe**: Silk ivory and muted gold, understated typography, clean geometric stars, quiet elegance.
4. **Midnight Celebration**: Deep night sky, twinkling constellations, dramatic purple/magenta neon sparks.
5. **Marigold Glow**: Amber floral illumination, floating genda phool (marigold petals), warm festive lighting.
6. **Festive Fun**: Playful celebratory colors, bouncing confetti, sparklers, and joyful family animations.

### 3. 🎨 Progressive Recipient Interactive Experience
1. **Welcome Screen**: Personalized sender & recipient dedication with an animated traditional wax-sealed Diwali envelope.
2. **Light the Diyas**: Interactive traditional brass lamps with realistic flame animations, glowing illumination halos, progressive completion feedback, and authentic temple bell chime.
3. **Rangoli Studio**: Interactive vector artwork with multi-color festive palette, tap-to-fill petals, undo/clear controls, and celebration fanfare.
4. **Fireworks Sky**: Touch & click HTML5 Canvas particle fireworks with auto-finale sparklers and gentle sound effects.
5. **Surprise Gift**: Unbox an animated gift box or scratch off an authentic metallic gold foil card with your finger.
6. **Memory Gallery**: Touch-friendly swipe carousel with photo captions and full-screen view.
7. **Personal Wishes**: Warm festive blessing parchment in English, Hindi, or Hinglish with personalized signature.
8. **Grand Finale**: Personalized Happy Diwali celebration, 1-tap WhatsApp sharing, Web Share API, Copy Link, and QR code.

### 4. 🛠️ Guided Mobile Creator Studio
- 7-step guided mobile wizard (no desktop-only sidebars).
- Live real-time mobile preview simulator (390px viewport frame) + full-screen test mode.
- Language support: English, हिन्दी (Hindi), and Hinglish.
- Tone presets: Traditional, Emotional, Warm, Funny, and Professional.
- Client-side browser storage (`localStorage`) for drafts and published creations.
- Password protection, scheduled opening dates, and expiry options.
- User-initiated Web Audio synthesizer for festive bell & sparkler chimes (zero external audio files).

---

## 📸 Screenshots & Previews

| Screen | Preview |
|---|---|
| **Mobile Landing Page** | `public/screenshots/landing-iphone-390.png` |
| **Android 360px View** | `public/screenshots/landing-android-360.png` |
| **Creator Studio: Template Picker** | `public/screenshots/studio-step1-templates.png` |
| **Creator Studio: Personalize** | `public/screenshots/studio-step2-personalize.png` |
| **Interactive Diya Lighting** | `public/screenshots/recipient-diyas-lit.png` |
| **Rangoli Studio** | `public/screenshots/recipient-rangoli.png` |
| **Published Share Hub** | `public/screenshots/published-share-page.png` |

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) v18.17+ or v20+ / v22+
- `npm` or `pnpm` or `yarn`

### 1. Clone the repository
```bash
git clone https://github.com/your-username/deepotsav.git
cd deepotsav
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser (or use DevTools Device Mode set to iPhone 14 or Pixel 7).

### 4. Build for production
```bash
npm run build
npm run start
```

---

## 🧪 Automated Testing

Deepotsav includes an end-to-end test suite using Playwright covering:
- Horizontal overflow validation across 360px, 390px, 430px, tablet, and desktop viewports.
- Studio creation wizard flow (templates, form filling, previewing, publishing).
- Recipient interactive activities (envelope opening, diya lighting, rangoli coloring).

Run the tests:
```bash
node test-e2e.mjs
```

---

## 🏗️ Technology Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: CSS Keyframes + HTML5 Canvas Particle Engine
- **Audio**: Web Audio API (real-time synthesizers, no heavy media assets)
- **State & Storage**: Pure Client-Side Browser Storage (`localStorage`)
- **PWA**: Web App Manifest (`/manifest.webmanifest`)

---

## 🪔 Celebration Demo

You can directly test the preset demo experience:
- **Royal Gold Demo**: [http://localhost:3000/experience/demo-royal-gold](http://localhost:3000/experience/demo-royal-gold)
- **Traditional Rangoli Demo**: [http://localhost:3000/experience/demo-rangoli](http://localhost:3000/experience/demo-rangoli)

---

## 📄 License

This project is licensed under the MIT License — feel free to customize and share the joy of Diwali!
