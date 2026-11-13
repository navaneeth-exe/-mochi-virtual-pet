import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const screensDir = path.resolve(__dirname, '..', 'submission', 'screenshots');
const subDir = path.resolve(__dirname, '..', 'submission');

if (!fs.existsSync(screensDir)) {
  fs.mkdirSync(screensDir, { recursive: true });
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function run() {
  console.log('====================================================');
  console.log('   MOCHI: CAPTURING 12 SUBMISSION SCREENSHOTS       ');
  console.log('====================================================\n');

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 440, height: 920, deviceScaleFactor: 2 });

  // 1. Welcome Screen
  console.log('[1/12] Capturing 01_welcome_screen.png...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
  await sleep(600);
  await page.screenshot({ path: path.join(screensDir, '01_welcome_screen.png') });

  // Enter Mochi Room
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const enter = btns.find((b) => b.textContent && b.textContent.includes('ENTER MOCHI'));
    if (enter) enter.click();
  });
  await sleep(800);

  // 2. Main Pet Screen (Default Idle/Happy)
  console.log('[2/12] Capturing 02_main_pet_screen.png...');
  await page.screenshot({ path: path.join(screensDir, '02_main_pet_screen.png') });

  // 3. Happy Expression
  console.log('[3/12] Capturing 03_happy_expression.png...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const happy = btns.find((b) => b.textContent && b.textContent.trim() === 'happy');
    if (happy) happy.click();
  });
  await sleep(500);
  await page.screenshot({ path: path.join(screensDir, '03_happy_expression.png') });

  // 4. Sad Expression
  console.log('[4/12] Capturing 04_sad_expression.png...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const sad = btns.find((b) => b.textContent && b.textContent.trim() === 'sad');
    if (sad) sad.click();
  });
  await sleep(500);
  await page.screenshot({ path: path.join(screensDir, '04_sad_expression.png') });

  // 5. Angry Expression
  console.log('[5/12] Capturing 05_angry_expression.png...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const angry = btns.find((b) => b.textContent && b.textContent.trim() === 'angry');
    if (angry) angry.click();
  });
  await sleep(500);
  await page.screenshot({ path: path.join(screensDir, '05_angry_expression.png') });

  // 6. Surprised Expression
  console.log('[6/12] Capturing 06_surprised_expression.png...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const surp = btns.find((b) => b.textContent && b.textContent.trim() === 'surprised');
    if (surp) surp.click();
  });
  await sleep(500);
  await page.screenshot({ path: path.join(screensDir, '06_surprised_expression.png') });

  // Return to happy for feeding
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const happy = btns.find((b) => b.textContent && b.textContent.trim() === 'happy');
    if (happy) happy.click();
  });
  await sleep(300);

  // 7. Feeding Interaction
  console.log('[7/12] Capturing 07_feeding_interaction.png...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const feed = btns.find((b) => b.textContent && (b.textContent.includes('Feed') || b.title?.includes('Feed')));
    if (feed) feed.click();
  });
  await sleep(400); // Capture mid-reaction
  await page.screenshot({ path: path.join(screensDir, '07_feeding_interaction.png') });
  await sleep(1500);

  // 8. Sleeping Interaction
  console.log('[8/12] Capturing 08_sleeping_interaction.png...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const sleepBtn = btns.find((b) => b.textContent && (b.textContent.includes('Sleep') || b.title?.includes('Sleep')));
    if (sleepBtn) sleepBtn.click();
  });
  await sleep(700);
  await page.screenshot({ path: path.join(screensDir, '08_sleeping_interaction.png') });

  // Wake up Mochi
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const wakeBtn = btns.find((b) => b.textContent && (b.textContent.includes('Wake') || b.textContent.includes('Sleep')));
    if (wakeBtn) wakeBtn.click();
  });
  await sleep(500);

  // 9. Task Management Screen
  console.log('[9/12] Capturing 09_task_management.png...');
  await page.evaluate(() => {
    const btn = document.querySelector('button[title="Companion Tasks"]');
    if (btn) btn.click();
  });
  await sleep(700);
  // Toggle a task for visual engagement
  await page.evaluate(() => {
    const cards = document.querySelectorAll('.group.cursor-pointer');
    if (cards.length > 0) cards[0].click();
  });
  await sleep(500);
  await page.screenshot({ path: path.join(screensDir, '09_task_management.png') });

  // Return to Pet Room
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const back = btns.find((b) => b.textContent && b.textContent.includes('Pet Room'));
    if (back) back.click();
  });
  await sleep(500);

  // 10. Shared Pet Invitation / Pairing Modal
  console.log('[10/12] Capturing 10_shared_pet_invitation.png...');
  await page.evaluate(() => {
    const btn = document.querySelector('button[title="View Shared Pet Room"]');
    if (btn) btn.click();
  });
  await sleep(700);
  await page.screenshot({ path: path.join(screensDir, '10_shared_pet_invitation.png') });

  // Close modal
  await page.evaluate(() => {
    const close = document.querySelector('button[aria-label="Close"]');
    if (close) close.click();
  });
  await sleep(400);

  // 12. Settings Screen Modal
  console.log('[12/12] Capturing 12_settings_screen.png...');
  await page.evaluate(() => {
    const btn = document.querySelector('button[title="Companion Settings"]');
    if (btn) btn.click();
  });
  await sleep(700);
  await page.screenshot({ path: path.join(screensDir, '12_settings_screen.png') });

  // Close modal
  await page.evaluate(() => {
    const close = document.querySelector('button[aria-label="Close"]');
    if (close) close.click();
  });
  await sleep(400);

  await browser.close();
  console.log('Puppeteer capture finished. Generating composite 11_multidevice_synchronized.png...');
}

run().catch((err) => {
  console.error('Error during screenshot capture:', err);
  process.exit(1);
});

