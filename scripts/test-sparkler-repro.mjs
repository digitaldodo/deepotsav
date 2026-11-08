import { chromium } from 'playwright';

async function testSparkler() {
  console.log('Testing sparkler ignition and UI responsiveness...');
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

  // Measure Zustand state update frequency
  await page.evaluate(() => {
    window._stateChangeCount = 0;
    window._changedKeys = {};
    let prevState = { ...window.useGameState.getState() };
    window.useGameState.subscribe((newState) => {
      window._stateChangeCount++;
      for (const k in newState) {
        if (newState[k] !== prevState[k]) {
          window._changedKeys[k] = (window._changedKeys[k] || 0) + 1;
        }
      }
      prevState = { ...newState };
    });
  });

  console.log('Igniting sparkler...');
  await page.evaluate(() => {
    const state = window.useGameState?.getState();
    state?.pickupSparkler();
    state?.igniteSparkler();
  });

  await page.waitForTimeout(2000);

  const stateChanges = await page.evaluate(() => window._stateChangeCount);
  const changedKeys = await page.evaluate(() => window._changedKeys);
  console.log('Number of Zustand state changes in 2 seconds:', stateChanges);
  console.log('Changed keys:', changedKeys);

  // Now try interacting with UI buttons
  const journalBtn = page.locator('button[title*="Journal"]').first();
  console.log('Trying to click Journal button while sparkler is burning...');
  await journalBtn.click();
  await page.waitForTimeout(500);

  const isJournalVisible = await page.locator('text=Diwali Exploration Journal').isVisible({ timeout: 2000 }).catch(() => false);
  console.log('Journal modal opened successfully:', isJournalVisible);

  await page.screenshot({ path: 'public/screenshots/sparkler-journal-test.png' });

  console.log('Errors:', errors);
  await browser.close();
}

testSparkler().catch(e => console.error(e));
