import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.resolve(__dirname, '..', 'submission', 'ultimate-design-overhaul', 'responsive');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

const VIEWPORT_MATRIX = [
  { name: '01_small_mobile_320x568', width: 320, height: 568, screen: 'pet' },
  { name: '02_standard_mobile_375x812', width: 375, height: 812, screen: 'pet' },
  { name: '03_large_mobile_390x844', width: 390, height: 844, screen: 'tasks' },
  { name: '04_large_mobile_430x932', width: 430, height: 932, screen: 'shared' },
  { name: '05_tablet_portrait_768x1024', width: 768, height: 1024, screen: 'pet' },
  { name: '06_tablet_landscape_1024x768', width: 1024, height: 768, screen: 'pet' },
  { name: '07_laptop_1366x768', width: 1366, height: 768, screen: 'pet' },
  { name: '08_desktop_1440x900', width: 1440, height: 900, screen: 'tasks' },
  { name: '09_large_desktop_1920x1080', width: 1920, height: 1080, screen: 'pet' },
];

async function run() {
  console.log('================================================================');
  console.log('   MOCHI: MANDATORY RESPONSIVE TESTING (9 VIEWPORTS)          ');
  console.log('================================================================\n');

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const testResults = [];

  for (const vp of VIEWPORT_MATRIX) {
    console.log(`[TESTING] ${vp.name} (${vp.width}x${vp.height})...`);
    await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 2 });
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
    await sleep(400);

    // Enter Mochi Room if on Welcome
    await page.evaluate(() => {
      const enter = Array.from(document.querySelectorAll('button')).find((b) =>
        b.textContent && b.textContent.includes('ENTER MOCHI')
      );
      if (enter) enter.click();
    });
    await sleep(500);

    // Navigate to target screen if requested
    if (vp.screen === 'tasks') {
      await page.evaluate(() => {
        // Try desktop nav first, then mobile bottom nav
        const btns = Array.from(document.querySelectorAll('nav button, button'));
        const taskBtn = btns.find((b) => b.textContent && b.textContent.includes('Tasks'));
        if (taskBtn) taskBtn.click();
      });
      await sleep(500);
    } else if (vp.screen === 'shared') {
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('nav button, button'));
        const sharedBtn = btns.find((b) => b.textContent && b.textContent.includes('Shared'));
        if (sharedBtn) sharedBtn.click();
      });
      await sleep(500);
    }

    // Check for Horizontal Overflow
    const overflowCheck = await page.evaluate(() => {
      const docWidth = document.documentElement.scrollWidth;
      const bodyWidth = document.body.scrollWidth;
      const clientWidth = window.innerWidth;
      const hasOverflow = bodyWidth > clientWidth || docWidth > clientWidth;
      return { hasOverflow, bodyWidth, clientWidth };
    });

    const isPass = !overflowCheck.hasOverflow;
    testResults.push({
      viewport: `${vp.width}x${vp.height}`,
      name: vp.name,
      noHorizontalOverflow: isPass,
      bodyWidth: overflowCheck.bodyWidth,
      windowWidth: overflowCheck.clientWidth,
    });

    console.log(`  -> Overflow Check: ${isPass ? 'PASS (Zero horizontal overflow)' : 'FAIL'} (Body: ${overflowCheck.bodyWidth}px, Win: ${overflowCheck.clientWidth}px)`);

    // Capture screenshot
    const shotPath = path.join(outputDir, `${vp.name}.png`);
    await page.screenshot({ path: shotPath });
    console.log(`  -> Saved screenshot: ${shotPath}`);
  }

  // 10. Also capture Retro Console Mode on Desktop (1440x900)
  console.log('[TESTING] 10_retro_console_desktop_1440x900...');
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.evaluate(() => {
    // Navigate to settings and toggle chassis mode
    const btns = Array.from(document.querySelectorAll('button'));
    const toggle = btns.find((b) => b.title && b.title.includes('Retro Console'));
    if (toggle) toggle.click();
  });
  await sleep(600);
  const consolePath = path.join(outputDir, '10_retro_console_desktop_1440x900.png');
  await page.screenshot({ path: consolePath });
  console.log(`  -> Saved screenshot: ${consolePath}`);

  await browser.close();

  console.log('\n================================================================');
  console.log('   RESPONSIVE MATRIX TEST REPORT                                ');
  console.log('================================================================');
  console.table(testResults);

  const allPassed = testResults.every((r) => r.noHorizontalOverflow);
  if (!allPassed) {
    console.error('Some viewports failed horizontal overflow checks!');
    process.exit(1);
  } else {
    console.log('\n✓ ALL 9 VIEWPORTS PASSED WITH ZERO HORIZONTAL OVERFLOW!');
  }
}

run().catch((err) => {
  console.error('Responsive matrix test failed:', err);
  process.exit(1);
});

