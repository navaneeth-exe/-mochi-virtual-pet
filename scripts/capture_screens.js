import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const subDir = path.resolve(__dirname, '..', 'submission');

async function run() {
  console.log('Launching Puppeteer Chrome...');
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  // Set mobile phone viewport (440 x 920)
  await page.setViewport({ width: 440, height: 920, deviceScaleFactor: 2 });
  console.log('Navigating to http://localhost:5173/...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });

  // 1. Welcome Screen
  const welcomePath = path.join(subDir, 'screenshot_welcome.png');
  await page.screenshot({ path: welcomePath });
  console.log('1. Captured Welcome Screen:', welcomePath);

  // 2. Click "ENTER MOCHI'S ROOM"
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const enter = btns.find(b => b.textContent.includes('ENTER MOCHI'));
    if (enter) enter.click();
  });
  await new Promise(r => setTimeout(r, 800));

  // 2. Main Pet Screen (Default Happy state)
  const mainPetPath = path.join(subDir, 'screenshot_main_pet.png');
  await page.screenshot({ path: mainPetPath });
  console.log('2. Captured Main Pet Screen:', mainPetPath);

  // 3. Click "Feed" Button
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const feed = btns.find(b => b.textContent.includes('Feed') || b.title?.includes('Feed'));
    if (feed) feed.click();
  });
  await new Promise(r => setTimeout(r, 600));

  // 4. Click Emotion Switcher to test Sad expression
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const sad = btns.find(b => b.textContent.trim() === 'sad');
    if (sad) sad.click();
  });
  await new Promise(r => setTimeout(r, 600));
  const emotionPath = path.join(subDir, 'screenshot_emotion_state.png');
  await page.screenshot({ path: emotionPath });
  console.log('3. Captured Emotion State (Sad):', emotionPath);

  // 5. Open Companion Tasks View
  await page.evaluate(() => {
    const btn = document.querySelector('button[title="Companion Tasks"]');
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 700));

  // Check off a task
  await page.evaluate(() => {
    const taskCards = document.querySelectorAll('.group.cursor-pointer');
    if (taskCards.length > 1) {
      taskCards[1].click(); // toggle second task
    }
  });
  await new Promise(r => setTimeout(r, 500));
  const tasksPath = path.join(subDir, 'screenshot_tasks.png');
  await page.screenshot({ path: tasksPath });
  console.log('4. Captured Tasks View:', tasksPath);

  // Return to Pet Room
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const back = btns.find(b => b.textContent.includes('Pet Room'));
    if (back) back.click();
  });
  await new Promise(r => setTimeout(r, 500));

  // 6. Open Shared Pet Room Modal
  await page.evaluate(() => {
    const btn = document.querySelector('button[title="View Shared Pet Room"]');
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 600));
  const sharedPath = path.join(subDir, 'screenshot_shared_room.png');
  await page.screenshot({ path: sharedPath });
  console.log('5. Captured Shared Room Modal:', sharedPath);

  // Close modal
  await page.evaluate(() => {
    const close = document.querySelector('button[aria-label="Close"]');
    if (close) close.click();
  });
  await new Promise(r => setTimeout(r, 400));

  // 7. Open Settings Modal
  await page.evaluate(() => {
    const btn = document.querySelector('button[title="Companion Settings"]');
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 600));
  const settingsPath = path.join(subDir, 'screenshot_settings.png');
  await page.screenshot({ path: settingsPath });
  console.log('6. Captured Settings Modal:', settingsPath);

  // Close modal
  await page.evaluate(() => {
    const close = document.querySelector('button[aria-label="Close"]');
    if (close) close.click();
  });
  await new Promise(r => setTimeout(r, 400));

  // 8. Desktop Retro Handheld Chassis Viewport (1040 x 860)
  await page.setViewport({ width: 1040, height: 860, deviceScaleFactor: 2 });
  await new Promise(r => setTimeout(r, 700));
  const desktopPath = path.join(subDir, 'screenshot_desktop_console.png');
  await page.screenshot({ path: desktopPath });
  console.log('7. Captured Desktop Console Viewport:', desktopPath);

  await browser.close();
  console.log('=== ALL 7 SCREENSHOTS CAPTURED SUCCESSFULLY! ===');
}

run().catch((err) => {
  console.error('Puppeteer capture failed:', err);
  process.exit(1);
});
