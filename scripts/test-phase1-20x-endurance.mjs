import { chromium } from 'playwright';

async function test20xSparklerEndurance() {
  console.log('--- STARTING 20x PHULJHADI IGNITION ENDURANCE TEST ---');
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', err => {
    errors.push(err.message);
  });

  await page.goto('http://localhost:3000');
  await page.waitForTimeout(1000);

  const skipBtn = page.locator('button:has-text("Skip")').first();
  if (await skipBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    await skipBtn.click();
  }
  await page.waitForTimeout(600);

  let successCount = 0;

  for (let i = 1; i <= 20; i++) {
    // 1. Pick up and ignite sparkler
    await page.evaluate(() => {
      const state = window.useGameState?.getState();
      state?.pickupSparkler();
      state?.igniteSparkler();
    });

    // Short burn time
    await page.waitForTimeout(150);

    // 2. Verify HUD is visible
    const hudVisible = await page.locator('header').first().isVisible();
    if (!hudVisible) throw new Error(`Iteration ${i}: HUD became invisible!`);

    // 3. Test Journal opening & closing during burning
    const journalBtn = page.locator('button[title*="Journal"]').first();
    await journalBtn.click();
    await page.waitForTimeout(80);

    const journalOpen = await page.locator('text=Diwali Exploration Journal').isVisible();
    if (!journalOpen) throw new Error(`Iteration ${i}: Journal failed to open while sparkler burning!`);

    // Close journal
    const closeBtn = page.locator('button[aria-label="Close Journal"]').first();
    await closeBtn.click();
    await page.waitForTimeout(80);

    // 4. Test Pause Menu open & resume
    const pauseBtn = page.locator('button[title*="Pause"]').first();
    await pauseBtn.click();
    await page.waitForTimeout(80);

    const pauseOpen = await page.locator('text=Settings & Pause').isVisible({ timeout: 1500 });
    if (!pauseOpen) throw new Error(`Iteration ${i}: Pause failed to open!`);

    const resumeBtn = page.locator('button:has-text("Resume Exploring")').first();
    await resumeBtn.click();
    await page.waitForTimeout(80);

    // 5. Check player did not teleport
    const playerPos = await page.evaluate(() => window.useGameState?.getState().playerPosition);
    if (!playerPos || Math.hypot(playerPos[0], playerPos[2]) > 60) {
      throw new Error(`Iteration ${i}: Player position corrupted/teleported: ${playerPos}`);
    }

    // 6. Drop sparkler and ready for next round
    await page.evaluate(() => {
      window.useGameState?.getState().dropSparkler();
    });
    await page.waitForTimeout(50);

    successCount++;
    if (i % 5 === 0) {
      console.log(`Passed ${i}/20 sparkler ignition cycles...`);
    }
  }

  console.log(`\n✅ 20x SPARKER ENDURANCE TEST PASSED: ${successCount}/20 successful iterations!`);
  console.log('Console Errors caught:', errors.length);
  await browser.close();
}

test20xSparklerEndurance().catch(e => {
  console.error('❌ Endurance test failed:', e);
  process.exit(1);
});
