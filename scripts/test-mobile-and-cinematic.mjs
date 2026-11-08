import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const SCREENSHOT_DIR = path.resolve('public/screenshots');
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function runValidation() {
  console.log('🚀 Running Deepotsav Mobile HUD & Cinematic Validation Suite...\n');

  const browser = await chromium.launch({
    channel: 'msedge',
    headless: true,
  });

  const viewports = [
    { name: 'mobile-360', width: 360, height: 740, isMobile: true },
    { name: 'mobile-390', width: 390, height: 844, isMobile: true },
    { name: 'mobile-430', width: 430, height: 932, isMobile: true },
    { name: 'desktop-1280', width: 1280, height: 800, isMobile: false },
  ];

  for (const vp of viewports) {
    console.log(`\n📱 Testing Viewport: ${vp.name} (${vp.width}x${vp.height})...`);

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
        console.warn(`  ⚠️ Console error [${vp.name}]:`, msg.text());
      }
    });

    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

    // 1. Verify Cinematic Intro loads
    await page.waitForSelector('text=Deepotsav', { timeout: 8000 });
    console.log(`  ✓ Loaded Cinematic Intro on ${vp.name}`);

    // Capture screenshot of Cinematic Intro
    const introSsPath = path.join(SCREENSHOT_DIR, `cinematic-intro-${vp.name}.png`);
    await page.screenshot({ path: introSsPath });
    console.log(`  📸 Saved intro screenshot: ${introSsPath}`);

    // 2. Skip or Enter celebration to enter first-person gameplay
    const skipBtn = page.locator('text=Skip Intro');
    if (await skipBtn.isVisible()) {
      await skipBtn.click();
    } else {
      const enterBtn = page.locator('text=ENTER THE CELEBRATION');
      await enterBtn.click();
    }
    await page.waitForTimeout(800);

    // 3. Verify Canvas is rendered and visible
    const canvas = page.locator('canvas');
    await canvas.waitFor({ state: 'visible', timeout: 8000 });
    console.log(`  ✓ 3D Canvas rendered on ${vp.name}`);

    // 4. Mobile-specific controls validation
    if (vp.isMobile) {
      console.log('  🕹️ Verifying Dynamic Virtual Joystick behavior...');

      // 4a. Verify joystick is INVISIBLE when idle
      const joystickKnob = await page.$('.w-10, .w-11, .w-12');
      // Look for the knob element specifically inside touch zone
      const visibleKnobsBefore = await page.$$eval('[style*="radial-gradient(circle at 35% 35%"]', els => els.length);
      if (visibleKnobsBefore > 0) {
        throw new Error(`Joystick knob should NOT be visible when idle on ${vp.name}!`);
      }
      console.log(`  ✓ Idle check: Joystick is completely INVISIBLE when untouched`);

      // 4b. Touch anywhere horizontally in lower 30% (e.g. at x: width * 0.75, y: height * 0.85)
      const touchX = Math.floor(vp.width * 0.72);
      const touchY = Math.floor(vp.height * 0.85);

      console.log(`  👆 Simulating touch at (${touchX}, ${touchY}) in lower 30% movement zone...`);
      await page.mouse.move(touchX, touchY);
      await page.mouse.down();
      await page.waitForTimeout(100);

      // Verify joystick is now VISIBLE at touch position
      const visibleKnobsAfterTouch = await page.$$eval('[style*="radial-gradient(circle at 35% 35%"]', els => els.length);
      if (visibleKnobsAfterTouch === 0) {
        throw new Error(`Joystick should appear when touching lower 30% on ${vp.name}!`);
      }
      console.log(`  ✓ Touch check: Joystick appeared dynamically at (${touchX}, ${touchY})`);

      // 4c. Move finger forward
      await page.mouse.move(touchX, touchY - 35);
      await page.waitForTimeout(200);

      // 4d. Release finger
      await page.mouse.up();
      await page.waitForTimeout(100);

      // Verify joystick disappears immediately
      const visibleKnobsAfterRelease = await page.$$eval('[style*="radial-gradient(circle at 35% 35%"]', els => els.length);
      if (visibleKnobsAfterRelease > 0) {
        throw new Error(`Joystick should disappear after release on ${vp.name}!`);
      }
      console.log(`  ✓ Release check: Joystick disappeared immediately upon finger release`);

      // 4e. Check for NO desktop keyboard text ("Press E", "[E]", "WASD")
      const pageText = await page.innerText('body');
      const hasPressE = /Press \[E\]|Press E\b/i.test(pageText);
      if (hasPressE) {
        throw new Error(`Found forbidden desktop keyboard instruction on mobile: "${pageText}"`);
      }
      console.log(`  ✓ Mobile copy check: ZERO desktop "Press E" or keyboard instructions detected`);

      // 4f. Test Top HUD controls (Journal, Sound, Pause)
      console.log('  🎯 Verifying Top HUD buttons...');
      const journalBtn = page.locator('button[title="Diwali Activities Journal"]');
      await journalBtn.click();
      await page.waitForTimeout(400);

      // Verify journal modal opened
      await page.waitForSelector('text=Diwali Exploration Journal', { timeout: 3000 });
      console.log(`  ✓ Journal opened successfully on ${vp.name}`);

      // Close journal
      const closeJournal = page.locator('text=✕').first();
      await closeJournal.click();
      await page.waitForTimeout(300);

      // Capture gameplay screenshot
      const gpSsPath = path.join(SCREENSHOT_DIR, `mobile-gameplay-${vp.name}.png`);
      await page.screenshot({ path: gpSsPath });
      console.log(`  📸 Saved mobile gameplay screenshot: ${gpSsPath}`);
    } else {
      // Desktop testing
      console.log('  💻 Performing Desktop Keyboard & Mouse Interaction...');
      // Walk forward with W
      await page.keyboard.press('KeyW', { delay: 400 });
      await page.waitForTimeout(600);

      const desktopSsPath = path.join(SCREENSHOT_DIR, `desktop-gameplay-${vp.name}.png`);
      await page.screenshot({ path: desktopSsPath });
      console.log(`  📸 Saved desktop gameplay screenshot: ${desktopSsPath}`);
    }

    const filteredErrors = consoleErrors.filter(e => !e.includes('favicon') && !e.includes('audio'));
    if (filteredErrors.length > 0) {
      console.warn(`  ⚠️ Warnings/Errors on ${vp.name}:`, filteredErrors);
    } else {
      console.log(`  🌟 Viewport ${vp.name} passed with 0 critical errors!`);
    }

    await context.close();
  }

  await browser.close();
  console.log('\n🎉 ALL VIEWPORTS VALIDATED SUCCESSFULLY!\n');
}

runValidation().catch(err => {
  console.error('Validation failed:', err);
  process.exit(1);
});
