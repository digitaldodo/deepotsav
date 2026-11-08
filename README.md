# 🪔 Deepotsav 3D — First-Person Interactive Diwali World

[![React](https://img.shields.io/badge/React-19-blue?style=flat&logo=react)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-r187-black?style=flat&logo=three.js)](https://threejs.org/)
[![React Three Fiber](https://img.shields.io/badge/R3F-v9-red?style=flat)](https://docs.pmnd.rs/react-three-fiber)
[![Vite](https://img.shields.io/badge/Vite-v8-purple?style=flat&logo=vite)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-gold.svg)](https://opensource.org/licenses/MIT)

**Deepotsav 3D** is an immersive, first-person 3D Diwali celebration exploration game that runs directly in your web browser. Instead of a conventional website or greeting card platform, users step into a living, beautifully decorated Indian neighbourhood during the Festival of Lights.

You can freely walk around from human eye level, enter a decorated Indian home, savor festive sweets from a traditional brass thali, ring the temple bell in the puja corner, design rangoli in the courtyard, walk through the neighbourhood pathway to the community park, ignite phuljhadi sparklers to draw glowing light trails in the air, and launch fireworks into the night sky.

**Frontend-only**: No backend, no login, no accounts, and zero external asset dependencies.

---

## 🗺️ The Connected 3D World

The world is a physically connected, contiguous environment where you walk through actual doors and pathways:

1. **Front Gate & Courtyard**:
   - Sandstone-paved courtyard with Auspicious *Toran* of marigold flowers and mango leaves.
   - Traditional Indian bungalow façade with warm light spilling from windows.
   - *Tulsi Kyari* (sacred basil planter shrine) surrounded by flickering clay diyas.
   - Traditional Indian charpai/jhula lounge seating with silk bolster pillows.
   - Interactive center **Rangoli Studio** on the courtyard floor.

2. **House Interior (Living Room)**:
   - Polished Indian teak wood floor with a rich Kashmiri embroidered carpet.
   - Carved wooden sofa (*diwan*) with crimson velvet and gold silk cushions.
   - Sideboard console with an inspectable family Diwali photo frame.
   - Decorative gift box waiting to be unboxed.
   - Festive wall hangings (*Shubh Labh*, brass art, hanging bells).

3. **Dining & Sweets Platter**:
   - Solid Sheesham dining table with a maroon velvet runner.
   - Hand-crafted traditional brass *thali* (platter) loaded with authentic sweets:
     - 🟡 **Laddoo** (golden boondi spheres with pistachio garnish)
     - 💎 **Kaju Katli** (silver-leaf coated diamond cashew fudge)
     - 🟤 **Gulab Jamun** (rich dark sweet dumplings in syrup)
     - 🟩 **Pista Barfi** (layered pistachio-almond fudge)
     - 🥟 **Modak** (fluted sacred steamed dumplings)
   - Real-time eating interactions with eating sound effects and sweet count reduction.

4. **Sacred Puja Corner**:
   - White Makrana marble plinth with gold trim.
   - Carved Teakwood Temple *Mandir* with tiered *Shikhara* and golden *Kalash*.
   - Brass *Lakshmi & Ganesha* idols in the sanctum sanctorum.
   - Hanging brass temple bell (*Ghanti*) that swings and rings when interacted.
   - Tall brass *Samai / Kuthu Vilakku* floor diyas with real-time illumination.
   - Brass *Urli* filled with water and floating fresh marigold and rose petals.

5. **Neighbourhood Pathway**:
   - Paved festive street lined with cast-iron Victorian-Indian street lamps.
   - Neighbouring houses adorned with fairy lights and illuminated windows.

6. **Community Park**:
   - Lush park grass and stone circular walking trails under a starry evening sky.
   - Park benches under blooming Gulmohar and Banyan trees with glowing paper lanterns (*Akash Kandils*).
   - **Sparkler Station**: Pick up a *phuljhadi* stick, ignite it with crackling sparks, and wave your mouse/finger to paint glowing light trails in 3D air!
   - **Fireworks Launch Pad**: Launch grand fireworks shows illuminating the night sky with golden, crimson, purple, and emerald particle bursts.

---

## 🎮 First-Person Controls

### Desktop Controls:
| Key | Action |
|---|---|
| **W, A, S, D** / Arrows | Walk forward, left, backward, right |
| **Mouse Move** | Look around (PointerLock 360° camera) |
| **E** / Left Click | Interact with objects (door, sweets, bell, diyas, sparklers) |
| **Shift** | Sprint / Walk faster |
| **Esc** | Pause menu & audio settings |

### Mobile Controls:
- **Left Virtual Analog Joystick**: Smooth directional walking.
- **Right Screen Swipe Area**: Drag to rotate first-person camera look.
- **Contextual Action Button**: Large, floating touch button (>52px) that illuminates when near interactive objects.
- **HUD Quick Actions**: 1-tap sound toggle and pause menu.

---

## 📸 Screenshots

| View | Screenshot |
|---|---|
| **Intro Presentation Screen** | `public/screenshots/3d-intro-screen.png` |
| **Courtyard & Home Entrance** | `public/screenshots/3d-courtyard-start.png` |
| **Diwali Exploration Journal** | `public/screenshots/3d-activity-journal.png` |
| **Approaching Front Door** | `public/screenshots/3d-approaching-door.png` |
| **Living Room Interior** | `public/screenshots/3d-living-room.png` |
| **Dining Table & Sweets Platter** | `public/screenshots/3d-sweets-table.png` |
| **Mobile Virtual Joystick View** | `public/screenshots/3d-mobile-view.png` |

---

## 🔊 Procedural Audio Engine

All sound effects and ambient music are synthesized on-demand using the **Web Audio API** ([`src/game/audio/AudioManager.ts`](src/game/audio/AudioManager.ts)):
- **Temple Bell**: Harmonic brass metallic bell resonance with exponential decay.
- **Diya Lighting**: Soft flame whoosh and warm resonance.
- **Sweets Eating**: Melodic crunch/chew bite sound.
- **Door Creak**: Wooden acoustic friction and swing.
- **Sparkler Crackle**: Continuous crackling high-pass pyrotechnic sound.
- **Fireworks**: Whistle launch followed by deep reverberant bass boom.
- **Ambient Drone**: Relaxing Indian *Tanpura / Raag Yaman* harmonic drones.

*Sound is disabled by default until the user clicks "Enter Celebration with Sound" or toggles the audio button.*

---

## 🚀 Quick Start Guide

### 1. Clone & Install
```bash
git clone https://github.com/digitaldodo/deepotsav.git
cd deepotsav
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 3. Build for Production
```bash
npm run build
npm run preview
```

---

## 🧪 Automated Testing

Deepotsav 3D includes Playwright end-to-end tests validating the first-person controller, canvas rendering, collision detection, and mobile joystick:
```bash
node test-3d-world.mjs
```

---

## 📦 Deployment to Vercel

Deepotsav 3D is a pure static Vite build. You can deploy it to Vercel with zero environment variables:
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Framework Preset**: Vite

---

## 📄 License
This project is licensed under the MIT License — celebrate the joy of Diwali!
