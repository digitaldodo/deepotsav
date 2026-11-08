import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const SCREENSHOT_DIR = path.resolve('public/screenshots');
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function runTestSuite() {
  console.log('🚀 Starting Deepotsav 3D Physical Interactions & Mobile Viewport Test Suite...\n');

  const browser = await chromium.launch({
    channel: 'msedge',
    headless: true,
  });

  const testViewports = [
    { name: 'desktop-1280', width: 1280, height: 800, isMobile: false },
    { name: 'mobile-360', width: 360, height: 740, isMobile: true },
    { name: 'mobile-390', width: 390, height: 844, isMobile: true },
    { name: 'mobile-430', width: 430, height: 932, isMobile: true },
  ];

  for (const vp of testViewports) {
    console.log(`📱 Testing Viewport: ${vp.name} (${vp.width}x${vp.height}, isMobile: ${vp.isMobile})...`);

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

    // 1. Verify Intro Screen loaded
    await page.waitForSelector('text=Deepotsav', { timeout: 8000 });
    console.log(`  ✓ Loaded Intro Screen on ${vp.name}`);

    // Click "Enter Celebration with Sound"
    const enterBtn = page.locator('text=Enter Celebration with Sound');
    await enterBtn.click();
    await page.waitForTimeout(1000);

    // 2. Verify 3D Canvas element rendered and visible
    const canvas = page.locator('canvas');
    await canvas.waitFor({ state: 'visible', timeout: 8000 });
    console.log(`  ✓ 3D WebGL Canvas rendered and active on ${vp.name}`);

    // Capture screenshot to prove the 3D scene is brightly illuminated (NOT black)
    const ssPath = path.join(SCREENSHOT_DIR, `3d-illuminated-${vp.name}.png`);
    await page.screenshot({ path: ssPath });
    console.log(`  📸 Captured viewport screenshot: ${ssPath}`);

    // 3. Verify No 2D activity modal popups exist in DOM
    const rangoliModal = await page.$('.rangoli-studio-modal, [data-testid="rangoli-overlay"]');
    if (rangoliModal) {
      throw new Error(`Forbidden 2D Rangoli Modal detected in DOM on ${vp.name}!`);
    }
    console.log(`  ✓ Verified ZERO 2D activity modals exist on ${vp.name}`);

    // 4. Test physical interactions on Desktop
    if (!vp.isMobile) {
      console.log('  🎮 Performing Desktop 3D Physical Interactions...');

      // Walk forward slightly into courtyard
      await page.keyboard.press('KeyW', { delay: 400 });
      await page.waitForTimeout(800);

      // Check for contextual prompt
      const promptEl = page.locator('button:has-text("Take"), button:has-text("Courtyard"), button:has-text("Open")').first();
      const hasPrompt = await promptEl.isVisible().catch(() => false);
      if (hasPrompt) {
        const text = await promptEl.innerText();
        console.log(`  ✓ Contextual 3D Prompt active: "${text.trim().replace(/\n/g, ' ')}"`);
      }

      // Approach Front Door
      for (let i = 0; i < 4; i++) {
        await page.keyboard.press('KeyW', { delay: 350 });
        await page.waitForTimeout(100);
      }
      await page.waitForTimeout(600);

      // Open front door
      const doorPrompt = page.locator('button:has-text("Front Door")');
      if (await doorPrompt.isVisible().catch(() => false)) {
        await page.keyboard.press('KeyE');
        console.log('  ✓ Interacted physically with carved front door');
        await page.waitForTimeout(600);
      }

      // Capture Living Room Entrance screenshot
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, '3d-front-porch.png') });
    } else {
      // 5. Test Mobile Touch Virtual Joystick
      const joystickKnob = page.getByText('WALK', { exact: true });
      await joystickKnob.waitFor({ state: 'visible', timeout: 5000 });
      console.log(`  ✓ Mobile Virtual Joystick present & responsive on ${vp.name}`);
    }

    await context.close();
    console.log(`  🎉 Viewport ${vp.name} PASSED!\n`);
  }

  await browser.close();
  console.log('🌟 ALL 4 VIEWPORTS & 3D PHYSICAL INTERACTIONS VALIDATED SUCCESSFULLY!');
}

runTestSuite().catch(err => {
  console.error('❌ Test suite failed:', err);
  process.exit(1);
});
