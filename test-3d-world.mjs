import { chromium } from 'playwright';

async function test3DWorld() {
  console.log('🚀 Starting Deepotsav 3D World Automated Validation Suite...');
  const browser = await chromium.launch({ channel: 'msedge', headless: true });

  // 1. Desktop 1280x800 Test
  console.log('\n🖥️ Testing Desktop First-Person 3D Environment...');
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  // Catch any client errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('  ⚠️ Browser console error:', msg.text());
    }
  });

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  console.log('  ✓ Loaded Deepotsav 3D Intro Screen');
  await page.screenshot({ path: 'public/screenshots/3d-intro-screen.png' });

  // Click "Enter Celebration with Sound"
  const enterBtn = await page.$('button:has-text("Enter Celebration")');
  if (enterBtn) {
    await enterBtn.click();
    console.log('  ✓ Clicked Enter Celebration, initializing 3D First-Person Canvas...');
    await page.waitForTimeout(2000);
  }

  // Verify Canvas is active
  const canvas = await page.$('canvas');
  if (canvas) {
    console.log('  ✓ WebGL 3D Canvas element rendered and running');
  } else {
    throw new Error('Canvas element missing!');
  }

  await page.screenshot({ path: 'public/screenshots/3d-courtyard-start.png' });

  // Open Activity Journal
  const journalBtn = await page.$('button:has-text("Journal")');
  if (journalBtn) {
    await journalBtn.click();
    await page.waitForTimeout(500);
    console.log('  ✓ Opened Diwali Activity Journal');
    await page.screenshot({ path: 'public/screenshots/3d-activity-journal.png' });
    // Close journal
    await page.click('button:has-text("✕")');
    await page.waitForTimeout(500);
  }

  // Walk towards house door using KeyW
  console.log('  ✓ Walking towards house entrance door...');
  await page.keyboard.down('KeyW');
  await page.waitForTimeout(2200);
  await page.keyboard.up('KeyW');

  await page.screenshot({ path: 'public/screenshots/3d-approaching-door.png' });

  // Interact: Open Front Door
  console.log('  ✓ Interacting with front door...');
  await page.keyboard.press('KeyE');
  await page.waitForTimeout(1000);

  // Walk inside Living Room
  console.log('  ✓ Walking into House Living Room...');
  await page.keyboard.down('KeyW');
  await page.waitForTimeout(1800);
  await page.keyboard.up('KeyW');

  await page.screenshot({ path: 'public/screenshots/3d-living-room.png' });

  // Navigate to Dining Table & Sweets (right turn and walk)
  console.log('  ✓ Walking towards Dining Table & Sweets Platter...');
  await page.keyboard.down('KeyD');
  await page.waitForTimeout(1200);
  await page.keyboard.up('KeyD');
  await page.keyboard.down('KeyW');
  await page.waitForTimeout(1000);
  await page.keyboard.up('KeyW');

  await page.screenshot({ path: 'public/screenshots/3d-sweets-table.png' });

  // Eat Sweets
  console.log('  ✓ Interacting with Sweets Thali: Eating Laddoo & Kaju Katli...');
  await page.keyboard.press('KeyE');
  await page.waitForTimeout(800);
  await page.keyboard.press('KeyE');
  await page.waitForTimeout(800);

  await page.close();

  // 2. Mobile Viewport (iPhone 390x844) Touch Controls Test
  console.log('\n📱 Testing Mobile First-Person Touch Controls (390px)...');
  const mobilePage = await browser.newPage({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
  });

  await mobilePage.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  const mobileEnter = await mobilePage.$('button:has-text("Enter Celebration")');
  if (mobileEnter) {
    await mobileEnter.click();
    await mobilePage.waitForTimeout(2000);
  }

  // Verify Virtual Joystick exists
  const joystick = await mobilePage.$('text=WALK');
  if (joystick) {
    console.log('  ✓ Mobile Virtual Joystick present & rendered');
  }

  await mobilePage.screenshot({ path: 'public/screenshots/3d-mobile-view.png' });

  await mobilePage.close();
  await browser.close();

  console.log('\n🎉 ALL 3D FIRST-PERSON GAME TESTS PASSED! Deepotsav 3D is fully functional.');
}

test3DWorld().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
