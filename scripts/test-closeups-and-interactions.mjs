import { chromium } from 'playwright';
import path from 'path';

const SCREENSHOT_DIR = path.resolve('public/screenshots');

async function runInteractionTour() {
  console.log('🚶 Starting Deepotsav Detailed Interaction & Scene Capture Tour...');

  const browser = await chromium.launch({
    channel: 'msedge',
    headless: true,
  });

  const page = await browser.newPage({
    viewport: { width: 1280, height: 800 },
  });

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  // Skip intro to enter courtyard directly
  const skipBtn = page.locator('text=Skip Intro');
  await skipBtn.waitFor({ state: 'visible', timeout: 8000 });
  await skipBtn.click();
  await page.waitForTimeout(1000);

  // 1. Capture Courtyard Spawn View (Facing Haveli & Central Rangoli)
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'tour-01-courtyard-facing-haveli.png') });
  console.log('  📸 Saved tour-01-courtyard-facing-haveli.png');

  // 2. Walk forward towards the Rangoli
  for (let i = 0; i < 4; i++) {
    await page.keyboard.press('KeyW', { delay: 250 });
    await page.waitForTimeout(60);
  }
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'tour-02-rangoli-close.png') });
  console.log('  📸 Saved tour-02-rangoli-close.png');

  // 3. Walk up to Haveli Verandah & Carved Front Doors
  for (let i = 0; i < 6; i++) {
    await page.keyboard.press('KeyW', { delay: 300 });
    await page.waitForTimeout(60);
  }
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'tour-03-door-approach.png') });
  console.log('  📸 Saved tour-03-door-approach.png');

  // 4. Open Haveli Doors with [E]
  await page.keyboard.press('KeyE');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'tour-04-doors-open.png') });
  console.log('  📸 Saved tour-04-doors-open.png');

  // 5. Walk inside Living Room / Baithak (through the doorway into interior)
  for (let i = 0; i < 6; i++) {
    await page.keyboard.press('KeyW', { delay: 300 });
    await page.waitForTimeout(60);
  }
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'tour-05-living-room-interior.png') });
  console.log('  📸 Saved tour-05-living-room-interior.png');

  await browser.close();
  console.log('🎉 Detailed Scene Tour Completed Successfully!');
}

runInteractionTour().catch(e => {
  console.error('Tour failed:', e);
  process.exit(1);
});
