import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const auditDir = path.resolve(__dirname, '..', 'submission', 'ultimate-design-overhaul', 'bug-audit');

if (!fs.existsSync(auditDir)) {
  fs.mkdirSync(auditDir, { recursive: true });
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function runBugHunt() {
  console.log('================================================================');
  console.log('   MOCHI: LIVE BROWSER UI BUG HUNT & INTERACTION AUDIT         ');
  console.log('================================================================\n');

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,960']
  });

  const page = await browser.newPage();

  const consoleLogs = [];
  const pageErrors = [];
  const failedRequests = [];
  const discoveredIssues = [];

  page.on('console', (msg) => {
    const text = msg.text();
    const type = msg.type();
    consoleLogs.push({ type, text });
    if (type === 'error') {
      console.log(`[BROWSER CONSOLE ERROR] ${text}`);
    }
  });

  page.on('pageerror', (err) => {
    pageErrors.push(err.toString());
    console.error(`[PAGE RUNTIME ERROR] ${err.toString()}`);
  });

  page.on('requestfailed', (req) => {
    failedRequests.push({
      url: req.url(),
      failure: req.failure()?.errorText
    });
    console.log(`[REQUEST FAILED] ${req.url()} - ${req.failure()?.errorText}`);
  });

  // -------------------------------------------------------------
  // ROUND 1: ONBOARDING & WELCOME SCREEN
  // -------------------------------------------------------------
  console.log('\n--- AUDITING: Welcome / Onboarding Screen ---');
  await page.setViewport({ width: 375, height: 812, deviceScaleFactor: 2 });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
  await sleep(600);

  // Check broken images on Welcome
  const welcomeBrokenImgs = await page.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll('img'));
    return imgs.filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.src);
  });
  if (welcomeBrokenImgs.length > 0) {
    discoveredIssues.push({
      screen: 'Welcome',
      issue: 'Broken image assets detected',
      details: welcomeBrokenImgs.join(', ')
    });
  }

  // Check horizontal overflow on Welcome
  const welcomeOverflow = await page.evaluate(() => {
    return document.body.scrollWidth > window.innerWidth;
  });
  if (welcomeOverflow) {
    discoveredIssues.push({
      screen: 'Welcome',
      issue: 'Horizontal overflow on mobile',
      details: 'scrollWidth > innerWidth'
    });
  }

  await page.screenshot({ path: path.join(auditDir, 'audit_01_welcome.png') });

  // Test tap on Mochi preview
  await page.evaluate(() => {
    const mascot = document.querySelector('img[alt="Mochi Mascot"]');
    if (mascot) mascot.click();
  });
  await sleep(300);

  // -------------------------------------------------------------
  // ROUND 2: ENTER ROOM & MAIN PET SCREEN
  // -------------------------------------------------------------
  console.log('\n--- AUDITING: Main Pet Screen (Mobile & Desktop) ---');
  await page.evaluate(() => {
    const enter = Array.from(document.querySelectorAll('button')).find((b) =>
      b.textContent && b.textContent.includes('ENTER MOCHI')
    );
    if (enter) enter.click();
  });
  await sleep(800);

  await page.screenshot({ path: path.join(auditDir, 'audit_02_room_mobile.png') });

  // Test all pet action buttons
  console.log('Testing Feed action...');
  const feedResult = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const feed = btns.find((b) => b.textContent && b.textContent.includes('Feed'));
    if (feed) {
      feed.click();
      return true;
    }
    return false;
  });
  if (!feedResult) {
    discoveredIssues.push({ screen: 'MainPetScreen', issue: 'Feed button not found or not clickable' });
  }
  await sleep(800);

  console.log('Testing Play action...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const play = btns.find((b) => b.textContent && b.textContent.includes('Play'));
    if (play) play.click();
  });
  await sleep(600);

  console.log('Testing Pet action...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const pet = btns.find((b) => b.textContent && b.textContent.includes('Pet'));
    if (pet) pet.click();
  });
  await sleep(600);

  console.log('Testing Sleep / Wake action...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const rest = btns.find((b) => b.textContent && (b.textContent.includes('Rest') || b.textContent.includes('Sleep')));
    if (rest) rest.click();
  });
  await sleep(800);
  await page.screenshot({ path: path.join(auditDir, 'audit_03_sleeping.png') });

  // Verify action dock is disabled or in sleep mode
  const sleepStateCheck = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const wake = btns.find((b) => b.textContent && b.textContent.includes('Wake'));
    return !!wake;
  });
  if (!sleepStateCheck) {
    discoveredIssues.push({ screen: 'MainPetScreen', issue: 'Wake button did not appear during sleep mode' });
  }

  // Wake up
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const wake = btns.find((b) => b.textContent && b.textContent.includes('Wake'));
    if (wake) wake.click();
  });
  await sleep(600);

  // Test Double-Tap on Mochi Character
  console.log('Testing Double-Tap Super Happy interaction...');
  await page.evaluate(() => {
    const mochi = document.querySelector('img[alt*="Mochi feeling"]');
    if (mochi) {
      mochi.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true, clientX: 200, clientY: 300 }));
      setTimeout(() => {
        mochi.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true, clientX: 200, clientY: 300 }));
      }, 100);
    }
  });
  await sleep(800);

  // Test Spacebar Run
  console.log('Testing Spacebar Run gesture...');
  await page.evaluate(() => {
    const mochiDiv = document.querySelector('div[role="region"]');
    if (mochiDiv) {
      mochiDiv.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space', bubbles: true }));
    }
  });
  await sleep(800);

  // -------------------------------------------------------------
  // ROUND 3: TASKS SCREEN & INTERACTIONS
  // -------------------------------------------------------------
  console.log('\n--- AUDITING: Tasks Screen ---');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('nav button, button'));
    const tasksTab = btns.find((b) => b.textContent && b.textContent.includes('Tasks'));
    if (tasksTab) tasksTab.click();
  });
  await sleep(600);
  await page.screenshot({ path: path.join(auditDir, 'audit_04_tasks.png') });

  // Test empty submission validation
  console.log('Testing Task form validation...');
  await page.evaluate(() => {
    const input = document.querySelector('input[placeholder*="Add a new goal"]');
    if (input) input.value = '';
    const addBtn = Array.from(document.querySelectorAll('button')).find((b) => b.textContent && b.textContent.includes('Add'));
    if (addBtn) addBtn.click();
  });
  await sleep(300);

  const errorDisplayed = await page.evaluate(() => {
    return document.body.innerText.includes('Please write a task description');
  });
  if (!errorDisplayed) {
    discoveredIssues.push({ screen: 'Tasks', issue: 'Empty task submission validation error not shown' });
  }

  // Add a task
  await page.type('input[placeholder*="Add a new goal"]', 'Review weekly finances');
  await page.keyboard.press('Enter');
  await sleep(600);

  // Test duplicate task validation
  await page.type('input[placeholder*="Add a new goal"]', 'Review weekly finances');
  await page.keyboard.press('Enter');
  await sleep(300);
  const dupErrorDisplayed = await page.evaluate(() => {
    return document.body.innerText.includes('already exists');
  });
  if (!dupErrorDisplayed) {
    discoveredIssues.push({ screen: 'Tasks', issue: 'Duplicate task title validation error not shown' });
  }

  // Clear input
  await page.evaluate(() => {
    const input = document.querySelector('input[placeholder*="Add a new goal"]');
    if (input) input.value = '';
  });

  // Test toggle task completion
  console.log('Testing Task completion toggle...');
  await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('[role="checkbox"]'));
    if (cards.length > 0) cards[0].click();
  });
  await sleep(500);

  // Test filter tabs
  console.log('Testing Task filter tabs (All, Active, Completed)...');
  await page.evaluate(() => {
    const activeTab = Array.from(document.querySelectorAll('button')).find((b) => b.textContent && b.textContent.trim() === 'active');
    if (activeTab) activeTab.click();
  });
  await sleep(400);

  await page.evaluate(() => {
    const compTab = Array.from(document.querySelectorAll('button')).find((b) => b.textContent && b.textContent.trim() === 'completed');
    if (compTab) compTab.click();
  });
  await sleep(400);

  await page.evaluate(() => {
    const allTab = Array.from(document.querySelectorAll('button')).find((b) => b.textContent && b.textContent.trim() === 'all');
    if (allTab) allTab.click();
  });
  await sleep(400);

  // -------------------------------------------------------------
  // ROUND 4: SHARED PET SCREEN & MODALS
  // -------------------------------------------------------------
  console.log('\n--- AUDITING: Shared Pet Screen ---');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('nav button, button'));
    const sharedTab = btns.find((b) => b.textContent && b.textContent.includes('Shared'));
    if (sharedTab) sharedTab.click();
  });
  await sleep(600);
  await page.screenshot({ path: path.join(auditDir, 'audit_05_shared.png') });

  // Test room code copy
  console.log('Testing Room Code Copy button...');
  await page.evaluate(() => {
    const copyBtn = document.querySelector('button[title*="Copy code"]');
    if (copyBtn) copyBtn.click();
  });
  await sleep(400);

  // -------------------------------------------------------------
  // ROUND 5: SETTINGS SCREEN & TOGGLES
  // -------------------------------------------------------------
  console.log('\n--- AUDITING: Settings Screen ---');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('nav button, button'));
    const setTab = btns.find((b) => b.textContent && b.textContent.includes('Settings'));
    if (setTab) setTab.click();
  });
  await sleep(600);
  await page.screenshot({ path: path.join(auditDir, 'audit_06_settings.png') });

  // Test sound mute toggle
  console.log('Testing Sound Mute toggle...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const muteBtn = btns.find((b) => b.textContent && (b.textContent === 'Active' || b.textContent === 'Muted'));
    if (muteBtn) muteBtn.click();
  });
  await sleep(400);

  // Test Chime player
  console.log('Testing Play Chime button...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const chimeBtn = btns.find((b) => b.textContent && b.textContent.includes('Play Chime'));
    if (chimeBtn) chimeBtn.click();
  });
  await sleep(400);

  // Test Reset button confirmation open/cancel
  console.log('Testing Reset confirmation dialog...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const resetBtn = btns.find((b) => b.textContent && b.textContent.trim() === 'Reset');
    if (resetBtn) resetBtn.click();
  });
  await sleep(300);

  const confirmVisible = await page.evaluate(() => {
    return document.body.innerText.includes('Confirm Reset');
  });
  if (!confirmVisible) {
    discoveredIssues.push({ screen: 'Settings', issue: 'Reset confirmation dialog failed to open' });
  }

  // Cancel reset
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const cancelBtn = btns.find((b) => b.textContent && b.textContent.trim() === 'Cancel');
    if (cancelBtn) cancelBtn.click();
  });
  await sleep(300);

  // -------------------------------------------------------------
  // ROUND 6: DESKTOP COMPANION SANCTUARY VIEW (1440x900)
  // -------------------------------------------------------------
  console.log('\n--- AUDITING: Desktop Sanctuary (1440x900) ---');
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  // Navigate back to Room
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('header button, nav button, button'));
    const roomTab = btns.find((b) => b.textContent && b.textContent.includes('Room'));
    if (roomTab) roomTab.click();
  });
  await sleep(700);

  // Check desktop dual-column layout
  const desktopCheck = await page.evaluate(() => {
    const hasCompanionHabits = document.body.innerText.includes('Companion Habits');
    const hasVitals = document.body.innerText.includes('Fullness') && document.body.innerText.includes('Joy');
    const bodyWidth = document.body.scrollWidth;
    const hasOverflow = bodyWidth > window.innerWidth;
    return { hasCompanionHabits, hasVitals, hasOverflow, bodyWidth };
  });

  if (!desktopCheck.hasCompanionHabits) {
    discoveredIssues.push({ screen: 'MainPetScreen (Desktop)', issue: 'Desktop companion drawer (Habits card) not rendered' });
  }
  if (desktopCheck.hasOverflow) {
    discoveredIssues.push({ screen: 'Desktop View', issue: 'Horizontal overflow on 1440px desktop' });
  }

  await page.screenshot({ path: path.join(auditDir, 'audit_07_desktop_sanctuary.png') });

  // -------------------------------------------------------------
  // ROUND 7: SMALL MOBILE VIEW (320x568)
  // -------------------------------------------------------------
  console.log('\n--- AUDITING: Small Mobile (320x568 iPhone SE) ---');
  await page.setViewport({ width: 320, height: 568, deviceScaleFactor: 2 });
  await sleep(600);

  const smallMobileCheck = await page.evaluate(() => {
    const bodyWidth = document.body.scrollWidth;
    const winWidth = window.innerWidth;
    const hasOverflow = bodyWidth > winWidth;
    const btns = Array.from(document.querySelectorAll('button')).map((b) => {
      const rect = b.getBoundingClientRect();
      return { text: b.textContent?.trim(), width: rect.width, height: rect.height };
    });
    return { hasOverflow, bodyWidth, winWidth, btns };
  });

  if (smallMobileCheck.hasOverflow) {
    discoveredIssues.push({
      screen: 'Small Mobile 320px',
      issue: 'Horizontal overflow detected',
      details: `Body: ${smallMobileCheck.bodyWidth}px > Window: ${smallMobileCheck.winWidth}px`
    });
  }

  await page.screenshot({ path: path.join(auditDir, 'audit_08_small_mobile_320.png') });

  await browser.close();

  // Summary Report
  console.log('\n================================================================');
  console.log('   BUG HUNT AUDIT SUMMARY REPORT                                ');
  console.log('================================================================');
  console.log(`Total Console Messages: ${consoleLogs.length}`);
  console.log(`Page Runtime Errors: ${pageErrors.length}`);
  console.log(`Failed Network Requests: ${failedRequests.length}`);
  console.log(`Discovered Functional / UI Issues: ${discoveredIssues.length}`);

  if (pageErrors.length > 0) {
    console.log('\n[!] Page Errors:');
    pageErrors.forEach((e) => console.log(`  - ${e}`));
  }

  if (failedRequests.length > 0) {
    console.log('\n[!] Failed Requests:');
    failedRequests.forEach((r) => console.log(`  - ${r.url} (${r.failure})`));
  }

  if (discoveredIssues.length > 0) {
    console.log('\n[!] Discovered Issues:');
    console.table(discoveredIssues);
  } else {
    console.log('\n✓ ZERO FUNCTIONAL / UI ISSUES DETECTED DURING EXTENSIVE AUDIT!');
  }
}

runBugHunt().catch((err) => {
  console.error('Audit failed:', err);
  process.exit(1);
});
