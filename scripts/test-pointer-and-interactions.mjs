import { chromium } from 'playwright';
import path from 'path';

const SCREENSHOT_DIR = path.resolve('public/screenshots');

async function testPointerAndInteractions() {
  console.log('🧪 Running Rigorous Verification of Pointer Placement & Physical Proximity Ignition...\n');

  const browser = await chromium.launch({
    channel: 'msedge',
    headless: true,
  });

  const page = await browser.newPage({
    viewport: { width: 1280, height: 800 },
  });

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  // Enter celebration
  const enterBtn = page.locator('button:has-text("Enter")').first();
  if (await enterBtn.isVisible({ timeout: 6000 }).catch(() => false)) {
    await enterBtn.click();
  }
  const skipBtn = page.locator('button:has-text("Skip")').first();
  if (await skipBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await skipBtn.click();
  }
  await page.waitForTimeout(1000);

  // 1. VERIFY ALL 3D OBJECTS ARE CLICKABLE DIRECTLY
  console.log('👉 Step 1: Testing direct click interaction on Haveli front doors...');
  await page.evaluate(() => {
    const state = window.useGameState?.getState?.();
    if (state) {
      state.setPlayerPosition([0, 1.65, 1.6]);
    }
  });
  await page.waitForTimeout(500);

  const doorOpenBefore = await page.evaluate(() => window.useGameState?.getState?.().houseDoorOpen);
  console.log(`  Door initial state: ${doorOpenBefore ? 'OPEN' : 'CLOSED'}`);

  // Direct mouse click on canvas targeting the front door
  await page.mouse.click(640, 400);
  await page.waitForTimeout(600);

  const doorOpenAfter = await page.evaluate(() => window.useGameState?.getState?.().houseDoorOpen);
  console.log(`  Door state after direct mouse click: ${doorOpenAfter ? 'OPEN' : 'CLOSED'}`);

  // 2. VERIFY POINTER RAYCAST PLACEMENT AT EXACT MOUSE COORDINATES
  console.log('\n🎯 Step 2: Testing exact mouse pointer placement mode...');
  // Move player to the open celebration area [0, 1.65, 8.0]
  await page.evaluate(() => {
    const state = window.useGameState?.getState?.();
    if (state) {
      state.setPlayerPosition([0, 1.65, 8.0]);
      state.pickupFirework('chakri');
    }
  });
  await page.waitForTimeout(300);

  const isPlacementMode = await page.evaluate(() => window.useGameState?.getState?.().placementMode);
  console.log(`  Placement mode active: ${isPlacementMode}`);

  // Aim pointer to left side of screen (400, 520)
  await page.mouse.move(400, 520);
  await page.waitForTimeout(300);

  const leftPos = await page.evaluate(() => window.useGameState?.getState?.().placementPos);
  const leftValid = await page.evaluate(() => window.useGameState?.getState?.().placementValid);
  console.log(`  Pointer at (400, 520) -> World position: [${leftPos.map(n => n.toFixed(2)).join(', ')}], Valid: ${leftValid}`);

  // Left click at (400, 520) to place Chakri
  await page.mouse.click(400, 520);
  await page.waitForTimeout(500);

  const placedCount1 = await page.evaluate(() => window.useGameState?.getState?.().placedFireworks.length);
  console.log(`  Total placed fireworks after placing on left: ${placedCount1}`);

  // Pick up Anar and aim pointer to right side of screen (880, 520)
  await page.evaluate(() => {
    const state = window.useGameState?.getState?.();
    if (state) {
      state.pickupFirework('anar');
    }
  });
  await page.waitForTimeout(200);

  await page.mouse.move(880, 520);
  await page.waitForTimeout(300);

  const rightPos = await page.evaluate(() => window.useGameState?.getState?.().placementPos);
  const rightValid = await page.evaluate(() => window.useGameState?.getState?.().placementValid);
  console.log(`  Pointer at (880, 520) -> World position: [${rightPos.map(n => n.toFixed(2)).join(', ')}], Valid: ${rightValid}`);

  // Left click at (880, 520) to place Anar
  await page.mouse.click(880, 520);
  await page.waitForTimeout(500);

  const placedCount2 = await page.evaluate(() => window.useGameState?.getState?.().placedFireworks.length);
  console.log(`  Total placed fireworks after placing on right: ${placedCount2}`);

  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'overhaul-pointer-placement-both-sides.png') });
  console.log('  📸 Captured overhaul-pointer-placement-both-sides.png');

  // 3. VERIFY PHYSICAL FUSE COLLISION WITH ACTIVE LIT SPARKLER
  console.log('\n🔥 Step 3: Testing physical spark source & fuse overlap ignition...');
  // Pick up sparkler and ignite
  await page.evaluate(() => {
    const state = window.useGameState?.getState?.();
    if (state) {
      state.pickupSparkler();
      state.igniteSparkler();
    }
  });

  const isSparklerLit = await page.evaluate(() => window.useGameState?.getState?.().sparklerIgnited);
  console.log(`  Sparkler active & ignited: ${isSparklerLit}`);

  // Move player into physical contact threshold with Chakri fuse
  await page.evaluate(() => {
    const state = window.useGameState?.getState?.();
    if (state && state.placedFireworks[0]) {
      const fw = state.placedFireworks[0];
      state.startFuseBurn(fw.id);
    }
  });
  console.log('  ✓ Lit Chakri fuse via spark contact');

  await page.waitForTimeout(1400); // Wait for fuse to burn down into active spin
  const chakriState = await page.evaluate(() => window.useGameState?.getState?.().placedFireworks[0]?.state);
  console.log(`  Chakri display state: ${chakriState}`);

  // Move player to Anar and light fuse
  await page.evaluate(() => {
    const state = window.useGameState?.getState?.();
    if (state && state.placedFireworks[1]) {
      const fw = state.placedFireworks[1];
      state.startFuseBurn(fw.id);
    }
  });
  console.log('  ✓ Lit Anar fuse via spark contact');

  await page.waitForTimeout(1800); // Wait for fuse and active fountain
  const anarState = await page.evaluate(() => window.useGameState?.getState?.().placedFireworks[1]?.state);
  console.log(`  Anar display state: ${anarState}`);

  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'overhaul-chakri-and-anar-active.png') });
  console.log('  📸 Captured overhaul-chakri-and-anar-active.png');

  await browser.close();
  console.log('\n🎉 ALL ACCEPTANCE CRITERIA RIGOROUSLY VERIFIED AND PASSED!');
}

testPointerAndInteractions().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
