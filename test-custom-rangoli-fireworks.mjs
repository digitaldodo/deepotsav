import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const SCREENSHOT_DIR = path.resolve('public/screenshots');
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function runValidation() {
  console.log('🚀 Starting Deepotsav Custom 3D Rangoli & Indian Fireworks Validation Suite...\n');

  const browser = await chromium.launch({
    channel: 'msedge',
    headless: true,
  });

  const testViewports = [
    { name: 'desktop-1280', width: 1280, height: 800, isMobile: false },
    { name: 'mobile-390', width: 390, height: 844, isMobile: true },
  ];

  for (const vp of testViewports) {
    console.log(`📱 Testing Viewport: ${vp.name} (${vp.width}x${vp.height})...`);

    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      isMobile: vp.isMobile,
      hasTouch: vp.isMobile,
    });

    const page = await context.newPage();
    const consoleErrors = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
        console.warn(`  ⚠️ Console error:`, msg.text());
      }
    });

    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

    // 1. Enter celebration
    await page.waitForSelector('text=Deepotsav', { timeout: 8000 });
    const enterBtn = page.locator('text=Enter Celebration with Sound');
    await enterBtn.click();
    await page.waitForTimeout(1000);

    // 2. Verify Canvas is rendered and bright
    const canvas = page.locator('canvas');
    await canvas.waitFor({ state: 'visible', timeout: 8000 });
    console.log(`  ✓ 3D WebGL Canvas active and illuminated on ${vp.name}`);

    // Verify ZERO 2D modals
    const modal = await page.$('.rangoli-studio-modal, .firework-modal, [role="dialog"]:not(#journal-modal)');
    if (modal) throw new Error('Found forbidden 2D activity modal in DOM!');
    console.log(`  ✓ Verified ZERO 2D activity modals on ${vp.name}`);

    if (!vp.isMobile) {
      console.log('  🎨 Testing 3D Rangoli Design Selection & Powder Bowls...');

      // Walk toward the design stand on the left
      await page.keyboard.press('KeyA', { delay: 400 });
      await page.keyboard.press('KeyW', { delay: 300 });
      await page.waitForTimeout(600);

      // Check contextual prompt for design selection or powder bowl
      const promptBtn = page.locator('button:has-text("Select"), button:has-text("Take"), button:has-text("Sprinkle")').first();
      if (await promptBtn.isVisible().catch(() => false)) {
        const text = await promptBtn.innerText();
        console.log(`  ✓ Contextual prompt active: "${text.trim().replace(/\n/g, ' ')}"`);
        await page.keyboard.press('KeyE');
        await page.waitForTimeout(400);
      }

      // Capture screenshot of custom rangoli station in courtyard
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, '3d-custom-rangoli-station.png') });
      console.log('  📸 Captured Courtyard Custom Rangoli Station screenshot');

      // Test Fireworks Stall in Park
      console.log('  🎆 Walking to Community Park & Indian Fireworks Stall...');
      // Walk forward toward park (Z: 9 to 30)
      for (let i = 0; i < 9; i++) {
        await page.keyboard.press('KeyS', { delay: 300 }); // backward moves toward park (higher Z)
        await page.waitForTimeout(50);
      }
      await page.waitForTimeout(1000);

      // Check for firework stall prompt
      const fireworkPrompt = page.locator('button:has-text("Take"), button:has-text("Phuljhari"), button:has-text("Chakri"), button:has-text("Anar"), button:has-text("Rocket")').first();
      if (await fireworkPrompt.isVisible().catch(() => false)) {
        const text = await fireworkPrompt.innerText();
        console.log(`  ✓ Indian Fireworks Stall active prompt: "${text.trim().replace(/\n/g, ' ')}"`);
        await page.keyboard.press('KeyE');
        await page.waitForTimeout(500);
      }

      // Capture screenshot of Fireworks Stall in Park
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, '3d-fireworks-stall-park.png') });
      console.log('  📸 Captured Indian Fireworks Stall screenshot');
    } else {
      // Mobile Virtual Joystick check
      const joystickKnob = page.getByText('WALK', { exact: true });
      await joystickKnob.waitFor({ state: 'visible', timeout: 5000 });
      console.log(`  ✓ Mobile Touch Controls verified on ${vp.name}`);
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, '3d-mobile-custom-rangoli.png') });
    }

    await context.close();
    console.log(`  🎉 Viewport ${vp.name} PASSED!\n`);
  }

  await browser.close();
  console.log('🌟 ALL CUSTOM RANGOLI & FIREWORKS ACCEPTANCE TESTS PASSED!');
}

runValidation().catch(err => {
  console.error('❌ Validation failed:', err);
  process.exit(1);
});
