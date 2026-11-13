import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.resolve(__dirname, '..', 'submission', 'ultimate-design-overhaul');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function run() {
  console.log('===============================================================');
  console.log('   MOCHI: PREMIUM TRANSFORMATION VERIFICATION & SCREENSHOTS   ');
  console.log('===============================================================\n');

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1200,980']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 440, height: 920, deviceScaleFactor: 2 });

  // 1. Welcome Screen
  console.log('[1/13] Navigating to Welcome Screen...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
  await sleep(600);
  await page.screenshot({ path: path.join(outputDir, '01_welcome_screen.png') });
  console.log('✓ Captured 01_welcome_screen.png');

  // 2. Enter Mochi's Room
  console.log('[2/13] Entering Mochi Room...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const enter = btns.find((b) => b.textContent && b.textContent.includes('ENTER MOCHI'));
    if (enter) enter.click();
  });
  await sleep(800);
  await page.screenshot({ path: path.join(outputDir, '02_main_pet_screen_modern.png') });
  console.log('✓ Captured 02_main_pet_screen_modern.png');

  // 3. Feeding Interaction
  console.log('[3/13] Triggering Feed Action...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const feed = btns.find((b) => b.textContent && (b.textContent.includes('Feed') || b.title?.includes('Feed')));
    if (feed) feed.click();
  });
  await sleep(400);
  await page.screenshot({ path: path.join(outputDir, '03_pet_feeding_interaction.png') });
  console.log('✓ Captured 03_pet_feeding_interaction.png');
  await sleep(1200);

  // 4. Sleeping Interaction
  console.log('[4/13] Tucking Mochi into Bed (Night Mode)...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const restBtn = btns.find((b) => b.textContent && (b.textContent.includes('Rest') || b.textContent.includes('Sleep')));
    if (restBtn) restBtn.click();
  });
  await sleep(800);
  await page.screenshot({ path: path.join(outputDir, '04_pet_sleeping_night.png') });
  console.log('✓ Captured 04_pet_sleeping_night.png');

  // Wake up Mochi
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const wakeBtn = btns.find((b) => b.textContent && b.textContent.includes('Wake'));
    if (wakeBtn) wakeBtn.click();
  });
  await sleep(600);

  // 5. Test Expressions
  console.log('[5/13] Capturing Happy expression...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find((b) => b.textContent && b.textContent.trim() === 'happy');
    if (btn) btn.click();
  });
  await sleep(400);
  await page.screenshot({ path: path.join(outputDir, '05_expression_happy.png') });

  console.log('[6/13] Capturing Sad expression...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find((b) => b.textContent && b.textContent.trim() === 'sad');
    if (btn) btn.click();
  });
  await sleep(400);
  await page.screenshot({ path: path.join(outputDir, '06_expression_sad.png') });

  console.log('[7/13] Capturing Angry expression...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find((b) => b.textContent && b.textContent.trim() === 'angry');
    if (btn) btn.click();
  });
  await sleep(400);
  await page.screenshot({ path: path.join(outputDir, '07_expression_angry.png') });

  console.log('[8/13] Capturing Surprised expression...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find((b) => b.textContent && b.textContent.trim() === 'surprised');
    if (btn) btn.click();
  });
  await sleep(400);
  await page.screenshot({ path: path.join(outputDir, '08_expression_surprised.png') });

  // Return to Happy
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find((b) => b.textContent && b.textContent.trim() === 'happy');
    if (btn) btn.click();
  });
  await sleep(300);

  // 9. Navigate to Tasks Screen via BottomNav
  console.log('[9/13] Navigating to Tasks Screen...');
  await page.evaluate(() => {
    const navBtns = Array.from(document.querySelectorAll('nav button'));
    const taskTab = navBtns.find((b) => b.textContent && b.textContent.includes('Tasks'));
    if (taskTab) taskTab.click();
  });
  await sleep(700);

  // Add a new task
  await page.type('input[placeholder*="Add a new goal"]', 'Evening 15-minute nature walk');
  await page.keyboard.press('Enter');
  await sleep(600);

  // Check off first task for celebratory completion
  await page.evaluate(() => {
    const cards = document.querySelectorAll('[role="checkbox"]');
    if (cards.length > 0) cards[0].click();
  });
  await sleep(500);
  await page.screenshot({ path: path.join(outputDir, '09_tasks_screen_progress.png') });
  console.log('✓ Captured 09_tasks_screen_progress.png');

  // 10. Navigate to Shared Screen via BottomNav
  console.log('[10/13] Navigating to Shared Pet Screen...');
  await page.evaluate(() => {
    const navBtns = Array.from(document.querySelectorAll('nav button'));
    const sharedTab = navBtns.find((b) => b.textContent && b.textContent.includes('Shared'));
    if (sharedTab) sharedTab.click();
  });
  await sleep(700);
  await page.screenshot({ path: path.join(outputDir, '10_shared_room_coparenting.png') });
  console.log('✓ Captured 10_shared_room_coparenting.png');

  // 11. Navigate to Settings Screen via BottomNav
  console.log('[11/13] Navigating to Settings Screen...');
  await page.evaluate(() => {
    const navBtns = Array.from(document.querySelectorAll('nav button'));
    const setTab = navBtns.find((b) => b.textContent && b.textContent.includes('Settings'));
    if (setTab) setTab.click();
  });
  await sleep(700);
  await page.screenshot({ path: path.join(outputDir, '11_settings_screen_customization.png') });
  console.log('✓ Captured 11_settings_screen_customization.png');

  // 12. Enable Retro Handheld Console Chassis
  console.log('[12/13] Toggling Retro Console Chassis...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const chassisBtn = btns.find((b) => b.textContent && (b.textContent.includes('Disabled') || b.textContent.includes('Enabled')));
    if (chassisBtn) chassisBtn.click();
  });
  await sleep(600);
  // Navigate back to Room
  await page.evaluate(() => {
    const navBtns = Array.from(document.querySelectorAll('nav button'));
    const roomTab = navBtns.find((b) => b.textContent && b.textContent.includes('Room'));
    if (roomTab) roomTab.click();
  });
  await sleep(700);
  await page.screenshot({ path: path.join(outputDir, '12_retro_console_chassis_view.png') });
  console.log('✓ Captured 12_retro_console_chassis_view.png');

  // 13. Desktop Wide Viewport (1200 x 920)
  console.log('[13/13] Capturing Desktop Wide Viewport...');
  await page.setViewport({ width: 1200, height: 920, deviceScaleFactor: 2 });
  await sleep(600);
  await page.screenshot({ path: path.join(outputDir, '13_desktop_wide_viewport.png') });
  console.log('✓ Captured 13_desktop_wide_viewport.png');

  await browser.close();
  console.log('\n===============================================================');
  console.log('   ALL 13 PREMIUM VERIFICATION SCREENSHOTS CAPTURED!          ');
  console.log('===============================================================\n');
}

run().catch((err) => {
  console.error('Verification failed:', err);
  process.exit(1);
});

