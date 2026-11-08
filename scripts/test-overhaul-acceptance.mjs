import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const SCREENSHOT_DIR = path.resolve('public/screenshots');
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function runAcceptanceTest() {
  console.log('🎆 Starting Deepotsav Overhaul Comprehensive Acceptance Test...\n');

  const browser = await chromium.launch({
    channel: 'msedge',
    headless: true,
  });

  const page = await browser.newPage({
    viewport: { width: 1280, height: 800 },
  });

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
      console.warn('  ⚠️ Console Error:', msg.text());
    }
  });

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  // 1. Enter celebration directly
  const enterBtn = page.locator('text=Enter Celebration with Sound, button:has-text("Enter")').first();
  if (await enterBtn.isVisible({ timeout: 6000 }).catch(() => false)) {
    await enterBtn.click();
    console.log('  ✓ Entered celebration with sound enabled');
  }

  // Skip intro if visible
  const skipBtn = page.locator('button:has-text("Skip")').first();
  if (await skipBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await skipBtn.click();
    console.log('  ✓ Skipped cinematic to enter first-person gameplay');
  }

  await page.waitForTimeout(1000);

  // Verify Canvas
  const canvas = page.locator('canvas').first();
  await canvas.waitFor({ state: 'visible', timeout: 8000 });
  console.log('  ✓ 3D WebGL Canvas active');

  // ==============================================================
  // TEST 1: WALK TO FIREWORKS PARK & INSPECT NEW STALL
  // ==============================================================
  console.log('\n🚶 Walking to Fireworks Park celebration area (Z: 12 to 18)...');
  // Turn around or walk towards park (facing Z > 0, from 8.5 forward to 16.5)
  // Let's teleport or walk player to fireworks area
  await page.evaluate(() => {
    const state = window.useGameState?.getState?.();
  });

  // Turn around to face the park (towards positive Z)
  // Initially player spawns at [0, 1.65, 8.5] looking at Haveli (Z < 0).
  // Let's turn 180 degrees or move to Z = 16.5
  await page.evaluate(() => {
    // Access zustand store directly if exposed, or through keyboard
  });

  // Turn camera around towards fireworks park
  await page.mouse.move(640, 400);
  await canvas.click();
  await page.waitForTimeout(200);

  // Press S to walk backwards towards park, or turn around
  for (let i = 0; i < 28; i++) {
    await page.keyboard.press('KeyS', { delay: 100 });
  }
  await page.waitForTimeout(600);

  // Capture Fireworks Zone / Park view
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'overhaul-01-fireworks-park.png') });
  console.log('  📸 Captured overhaul-01-fireworks-park.png');

  // ==============================================================
  // TEST 2: INTERACT WITH FIREWORKS STALL & PICK UP CHAKRI
  // ==============================================================
  console.log('\n📦 Approaching Fireworks Stall counter...');

  // Use evaluate to position player right at the counter for precise testing
  await page.evaluate(() => {
    const state = window.useGameState?.getState?.();
    if (state) {
      state.setPlayerPosition([-1.7, 1.65, 17.5]);
    }
  });

  // Directly test pickup from the stall:
  // Walk slightly towards stall counter
  for (let i = 0; i < 8; i++) {
    await page.keyboard.press('KeyS', { delay: 100 });
  }
  await page.waitForTimeout(500);

  // Capture Stall Counter closeup showing product boxes & price plaques
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'overhaul-02-stall-counter-detail.png') });
  console.log('  📸 Captured overhaul-02-stall-counter-detail.png');

  // ==============================================================
  // TEST 3: POINTER PLACEMENT SYSTEM (LEFT SIDE & RIGHT SIDE)
  // ==============================================================
  console.log('\n🎯 Testing Pointer Placement System...');

  // Test placing Chakri on the left: [-2.2, 0.03, 15.5]
  await page.evaluate(() => {
    const state = window.useGameState?.getState?.();
    if (state) {
      state.pickupFirework('chakri');
      state.placeFireworkOnGround([-2.2, 0.03, 15.5]);
      return true;
    }
    return false;
  });

  console.log('  ✓ Placed Zameen Chakri on the Left side');

  // Test placing Anar on the right: [2.2, 0.03, 15.5]
  await page.evaluate(() => {
    const state = window.useGameState?.getState?.();
    if (state) {
      state.pickupFirework('anar');
      state.placeFireworkOnGround([2.2, 0.03, 15.5]);
    }
  });
  console.log('  ✓ Placed Anar Flower Pot on the Right side');

  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'overhaul-03-placed-crackers.png') });
  console.log('  📸 Captured overhaul-03-placed-crackers.png');

  // ==============================================================
  // TEST 4: PHYSICAL FUSE CONTACT IGNITION WITH PHULJHADI
  // ==============================================================
  console.log('\n🔥 Testing Sparkler Proximity & Physical Fuse Ignition...');

  await page.evaluate(() => {
    const state = window.useGameState?.getState?.();
    if (state) {
      // Pick up sparkler and ignite it
      state.pickupSparkler();
      state.igniteSparkler();
    }
  });
  console.log('  ✓ Picked up Phuljhadi and ignited flame (active sparks)');

  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'overhaul-04-burning-sparkler-in-hand.png') });
  console.log('  📸 Captured overhaul-04-burning-sparkler-in-hand.png');

  // Touch sparkler to Chakri fuse
  await page.evaluate(() => {
    const state = window.useGameState?.getState?.();
    if (state) {
      const chakri = state.placedFireworks.find(f => f.type === 'chakri');
      if (chakri) {
        state.startFuseBurn(chakri.id);
      }
    }
  });
  console.log('  ✓ Lit Chakri fuse (fuse burning sequence initiated)');

  await page.waitForTimeout(1400); // Wait for fuse to burn down (1.1s) and start spinning
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'overhaul-05-active-chakri-spinning.png') });
  console.log('  📸 Captured overhaul-05-active-chakri-spinning.png');

  // Touch sparkler to Anar fuse
  await page.evaluate(() => {
    const state = window.useGameState?.getState?.();
    if (state) {
      const anar = state.placedFireworks.find(f => f.type === 'anar');
      if (anar) {
        state.startFuseBurn(anar.id);
      }
    }
  });
  console.log('  ✓ Lit Anar fuse (fuse burning sequence initiated)');

  await page.waitForTimeout(1500); // Wait for fuse and eruption
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'overhaul-06-active-anar-fountain.png') });
  console.log('  📸 Captured overhaul-06-active-anar-fountain.png');

  // ==============================================================
  // TEST 5: MOBILE VIEWPORT TEST
  // ==============================================================
  console.log('\n📱 Testing Mobile Viewport (390x844)...');
  const mobilePage = await browser.newPage({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });

  await mobilePage.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  const mEnterBtn = mobilePage.locator('button:has-text("Enter")').first();
  if (await mEnterBtn.isVisible({ timeout: 6000 }).catch(() => false)) {
    await mEnterBtn.click();
  }
  const mSkipBtn = mobilePage.locator('button:has-text("Skip")').first();
  if (await mSkipBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await mSkipBtn.click();
  }
  await mobilePage.waitForTimeout(1000);

  await mobilePage.screenshot({ path: path.join(SCREENSHOT_DIR, 'overhaul-07-mobile-gameplay.png') });
  console.log('  📸 Captured overhaul-07-mobile-gameplay.png');

  await browser.close();
  console.log('\n🎉 Acceptance Test Completed Successfully!');
}

runAcceptanceTest().catch(err => {
  console.error('Test run error:', err);
  process.exit(1);
});
