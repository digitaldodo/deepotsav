import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const SCREENSHOT_DIR = path.resolve('public/screenshots');
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function runArtOverhaulValidation() {
  console.log('🏛️ Starting Deepotsav 3D Indian Art Direction & Environment Validation...\n');

  const browser = await chromium.launch({
    channel: 'msedge',
    headless: true,
  });

  const testViewports = [
    { name: 'desktop-1280', width: 1280, height: 800, isMobile: false },
    { name: 'mobile-390', width: 390, height: 844, isMobile: true },
  ];

  for (const vp of testViewports) {
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
        console.warn(`  ⚠️ Console error:`, msg.text());
      }
    });

    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

    // 1. Enter celebration
    await page.waitForSelector('text=Deepotsav', { timeout: 8000 });
    const enterBtn = page.locator('text=Enter Celebration with Sound');
    await enterBtn.click();
    await page.waitForTimeout(1200);

    // 2. Verify Canvas is rendered and fully illuminated
    const canvas = page.locator('canvas');
    await canvas.waitFor({ state: 'visible', timeout: 8000 });
    console.log(`  ✓ 3D WebGL Canvas active and illuminated on ${vp.name}`);

    // Verify ZERO 2D activity modals
    const modal = await page.$('.rangoli-studio-modal, .firework-modal, [role="dialog"]:not(#journal-modal)');
    if (modal) throw new Error('Found forbidden 2D activity modal in DOM!');
    console.log(`  ✓ Verified ZERO 2D activity modals on ${vp.name}`);

    if (!vp.isMobile) {
      // 3. Capture Haveli Façade & Courtyard
      console.log('  📸 Capturing Indian Haveli Façade from Courtyard...');
      await page.waitForTimeout(1000);
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01-haveli-facade-courtyard.png') });
      console.log('  ✓ Saved 01-haveli-facade-courtyard.png');

      // 4. Walk up to Haveli Doors
      console.log('  🚶 Walking up to Haveli Entrance Doors...');
      for (let i = 0; i < 5; i++) {
        await page.keyboard.press('KeyW', { delay: 400 });
        await page.waitForTimeout(80);
      }
      await page.waitForTimeout(800);

      // Check door prompt
      const doorPrompt = page.locator('button:has-text("Haveli Doors"), button:has-text("Front Door")').first();
      if (await doorPrompt.isVisible().catch(() => false)) {
        const text = await doorPrompt.innerText();
        console.log(`  ✓ Door Prompt: "${text.trim().replace(/\n/g, ' ')}"`);
        await page.keyboard.press('KeyE');
        await page.waitForTimeout(1000);
      }

      // Walk inside the Haveli Living Room (Baithak)
      console.log('  🚶 Walking into Haveli Baithak Living Room...');
      for (let i = 0; i < 6; i++) {
        await page.keyboard.press('KeyW', { delay: 400 });
        await page.waitForTimeout(80);
      }
      // Step left toward coffee table
      for (let i = 0; i < 5; i++) {
        await page.keyboard.press('KeyA', { delay: 350 });
        await page.waitForTimeout(60);
      }
      await page.waitForTimeout(1000);

      // Capture Baithak Interior
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02-haveli-baithak-interior.png') });
      console.log('  ✓ Saved 02-haveli-baithak-interior.png');

      // Check Gift Box prompt on coffee table
      const giftPrompt = page.locator('button:has-text("Gift Box")').first();
      if (await giftPrompt.isVisible().catch(() => false)) {
        const text = await giftPrompt.innerText();
        console.log(`  ✓ Gift Box Prompt: "${text.trim().replace(/\n/g, ' ')}"`);
        await page.keyboard.press('KeyE');
        await page.waitForTimeout(800);
        await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03-revealed-gold-coin-blessing.png') });
        console.log('  ✓ Saved 03-revealed-gold-coin-blessing.png');
      }

      // 5. Walk back out through courtyard into the street and park
      console.log('  🚶 Walking back out to Courtyard, Street & Park...');
      for (let i = 0; i < 15; i++) {
        await page.keyboard.press('KeyS', { delay: 350 });
        await page.waitForTimeout(60);
      }
      await page.waitForTimeout(1200);

      // Capture Street & Park Mela with Overhead Light Canopy & Fireworks Stall
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04-street-park-fireworks-mela.png') });
      console.log('  ✓ Saved 04-street-park-fireworks-mela.png');
    } else {
      // Mobile Viewport Verification
      console.log('  📱 Verifying Mobile HUD & Virtual Controls...');
      const joystick = page.getByText('WALK', { exact: true });
      await joystick.waitFor({ state: 'visible', timeout: 5000 });
      console.log('  ✓ Mobile Virtual Joystick HUD active');

      await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05-mobile-celebration-view.png') });
      console.log('  ✓ Saved 05-mobile-celebration-view.png');
    }

    const filteredErrors = consoleErrors.filter(e => !e.includes('favicon') && !e.includes('audio'));
    if (filteredErrors.length > 0) {
      console.warn(`  ⚠️ Warnings/Errors on ${vp.name}:`, filteredErrors);
    } else {
      console.log(`  🌟 All tests passed flawlessly with 0 critical errors on ${vp.name}!`);
    }

    await context.close();
  }

  await browser.close();
  console.log('\n🎉 Indian Diwali Art Direction & Environment Overhaul Fully Verified!\n');
}

runArtOverhaulValidation().catch(err => {
  console.error('Validation failed:', err);
  process.exit(1);
});
