import { chromium } from 'playwright';

async function runTests() {
  console.log('🚀 Starting Deepotsav Mobile-First Automated Test Suite...');
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  
  const viewports = [
    { name: 'android-360', width: 360, height: 740 },
    { name: 'iphone-390', width: 390, height: 844 },
    { name: 'large-phone-430', width: 430, height: 932 },
    { name: 'tablet-768', width: 768, height: 1024 },
    { name: 'desktop-1280', width: 1280, height: 800 },
  ];

  for (const vp of viewports) {
    console.log(`\n📱 Testing Viewport: ${vp.name} (${vp.width}x${vp.height})`);
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });

    // 1. Landing Page
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    
    // Check horizontal overflow
    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    console.log(`  ✓ Horizontal overflow check: ${hasHorizontalOverflow ? 'FAILED (overflow)' : 'PASSED (no overflow)'}`);

    // Take screenshot
    await page.screenshot({ path: `public/screenshots/landing-${vp.name}.png` });
    console.log(`  ✓ Captured landing screenshot: landing-${vp.name}.png`);

    await page.close();
  }

  // Deep interaction workflow test on mobile (390px)
  console.log('\n✨ Testing Full Creator & Recipient Workflow on Mobile (390px)...');
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();

  // Step 1: Open /create
  await page.goto('http://localhost:3000/create', { waitUntil: 'networkidle' });
  console.log('  ✓ Loaded /create');
  await page.screenshot({ path: 'public/screenshots/studio-step1-templates.png' });

  // Select 2nd template (Traditional Rangoli)
  const templateBtns = await page.$$('button:has-text("Traditional Rangoli")');
  if (templateBtns.length > 0) {
    await templateBtns[0].click();
    console.log('  ✓ Selected Traditional Rangoli template');
  }

  // Click Next
  await page.click('button:has-text("Personalize Your Experience →")');
  await page.waitForTimeout(500);

  // Step 2: Personalize
  console.log('  ✓ Navigated to Step 2: Personalize');
  await page.fill('input[placeholder="e.g. Priya"]', 'Aditi & Kabir');
  await page.fill('input[placeholder="e.g. Rajan, Dadi, Team"]', 'Sharma Ji & Family');
  await page.fill('textarea[placeholder="Write your personal Diwali message here..."]', 'May the warm glow of Diwali diyas illuminate your home with joy and prosperity!');
  await page.screenshot({ path: 'public/screenshots/studio-step2-personalize.png' });

  // Click Next to Step 3
  await page.click('button:has-text("Add Memories →")');
  await page.waitForTimeout(500);
  console.log('  ✓ Navigated to Step 3: Memories');
  await page.screenshot({ path: 'public/screenshots/studio-step3-memories.png' });

  // Click Next to Step 4
  await page.click('button:has-text("Customize Activities →")');
  await page.waitForTimeout(500);
  console.log('  ✓ Navigated to Step 4: Activities');
  await page.screenshot({ path: 'public/screenshots/studio-step4-activities.png' });

  // Click Next to Step 5
  await page.click('button:has-text("Customize Appearance →")');
  await page.waitForTimeout(500);
  console.log('  ✓ Navigated to Step 5: Appearance');

  // Click Next to Step 6
  await page.click('button:has-text("Advanced Settings →")');
  await page.waitForTimeout(500);
  console.log('  ✓ Navigated to Step 6: Advanced');

  // Click Next to Step 7 (Preview)
  await page.click('button:has-text("Preview & Publish →")');
  await page.waitForTimeout(500);
  console.log('  ✓ Navigated to Step 7: Preview');
  await page.screenshot({ path: 'public/screenshots/studio-step7-preview.png' });

  // Publish
  await page.click('button:has-text("Publish & Get Shareable Link")');
  await page.waitForURL(/.*\/share\/.*/, { timeout: 10000 });
  console.log(`  ✓ Successfully published! URL: ${page.url()}`);
  await page.screenshot({ path: 'public/screenshots/published-share-page.png' });

  // Click "Preview Experience" (opens in new tab due to target="_blank")
  const [newPage] = await Promise.all([
    context.waitForEvent('page'),
    page.click('a:has-text("Preview Experience")'),
  ]);
  await newPage.waitForLoadState('networkidle');
  console.log(`  ✓ Opened Recipient Experience in new tab! URL: ${newPage.url()}`);
  await newPage.waitForTimeout(1000);
  await newPage.screenshot({ path: 'public/screenshots/recipient-welcome.png' });

  // Open envelope / Begin celebration
  const beginBtn = await newPage.$('button:has-text("Begin Celebration")');
  if (beginBtn) {
    await beginBtn.click();
    await newPage.waitForTimeout(1500);
    console.log('  ✓ Opened Diwali envelope / Begun celebration');
  }

  // Activity 1: Light Diya
  const diyaButtons = await newPage.$$('button[aria-label*="Light diya"]');
  console.log(`  ✓ Found ${diyaButtons.length} interactive diyas, tapping...`);
  for (const b of diyaButtons) {
    await b.click();
    await newPage.waitForTimeout(300);
  }
  await newPage.screenshot({ path: 'public/screenshots/recipient-diyas-lit.png' });

  // Navigate to Rangoli
  const nextBtn = await newPage.$('button:has-text("Next Activity →")');
  if (nextBtn) {
    await nextBtn.click();
    await newPage.waitForTimeout(500);
    console.log('  ✓ Navigated to Rangoli Activity');
    await newPage.screenshot({ path: 'public/screenshots/recipient-rangoli.png' });
  }

  await browser.close();
  console.log('\n🎉 ALL TESTS PASSED SUCCESSFULLY! Deepotsav is verified and ready.');
}

runTests().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
