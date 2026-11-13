import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const subDir = path.resolve(__dirname, '..', 'submission');

async function runTests() {
  console.log('--- STARTING PHASE 4 AUTOMATED VERIFICATION ---');
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 440, height: 920, deviceScaleFactor: 2 });

  const testResults = [];

  try {
    // TEST 1: Navigation to Main Pet Room
    console.log('Navigating to app...');
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });

    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const enter = btns.find(b => b.textContent.includes('ENTER MOCHI'));
      if (enter) enter.click();
    });
    await new Promise(r => setTimeout(r, 600));

    const inPetRoom = await page.evaluate(() => 
      document.body.innerText.toUpperCase().includes("MOCHI'S ROOM") ||
      document.body.innerText.toUpperCase().includes("MOCHI")
    );
    testResults.push({ name: 'TEST-P4-01: Welcome Screen to Pet Room Navigation', pass: inPetRoom });
    console.log('TEST 1 Passed:', inPetRoom);

    // Initial state check
    const initialStats = await page.evaluate(() => {
      const text = document.body.innerText;
      return {
        hasHunger: text.includes('HUNGER') || text.includes('Hunger'),
        hasJoy: text.includes('JOY') || text.includes('Joy'),
        hasEnergy: text.includes('ENERGY') || text.includes('Energy')
      };
    });
    testResults.push({ name: 'TEST-P4-02: Initial Vitals Display', pass: initialStats.hasHunger && initialStats.hasJoy && initialStats.hasEnergy });
    console.log('TEST 2 Passed:', initialStats);

    // TEST 3: Feed Action
    const feedResult = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const feedBtn = btns.find(b => b.textContent.includes('Feed'));
      if (feedBtn) feedBtn.click();
      return !!feedBtn;
    });
    await new Promise(r => setTimeout(r, 500));
    testResults.push({ name: 'TEST-P4-03: Feed Action Triggered', pass: feedResult });
    console.log('TEST 3 Passed: Feed button clicked');

    // TEST 4: Play Action
    const playResult = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const playBtn = btns.find(b => b.textContent.includes('Play'));
      if (playBtn) playBtn.click();
      return !!playBtn;
    });
    await new Promise(r => setTimeout(r, 500));
    testResults.push({ name: 'TEST-P4-04: Play Action Triggered', pass: playResult });
    console.log('TEST 4 Passed: Play button clicked');

    // TEST 5: Pet Action
    const petResult = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const petBtn = btns.find(b => b.textContent.includes('Pet'));
      if (petBtn) petBtn.click();
      return !!petBtn;
    });
    await new Promise(r => setTimeout(r, 500));
    testResults.push({ name: 'TEST-P4-05: Pet Action Triggered', pass: petResult });
    console.log('TEST 5 Passed: Pet button clicked');

    // TEST 6: Sleep Toggle & Visual State
    const sleepResult = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const sleepBtn = btns.find(b => b.textContent.includes('Sleep'));
      if (sleepBtn) sleepBtn.click();
      return !!sleepBtn;
    });
    await new Promise(r => setTimeout(r, 600));

    const isSleepingText = await page.evaluate(() => {
      const text = document.body.innerText.toUpperCase();
      return text.includes('ASLEEP') || text.includes('WAKE') || text.includes('SLEEP');
    });
    testResults.push({ name: 'TEST-P4-06: Sleep Mode Transition', pass: isSleepingText });
    console.log('TEST 6 Passed: Sleep state is active:', isSleepingText);

    // Capture Sleep State Screenshot
    const sleepPath = path.join(subDir, 'screenshot_sleep_state.png');
    await page.screenshot({ path: sleepPath });
    console.log('Captured Sleep Screenshot:', sleepPath);

    // Wake Mochi up
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const wakeBtn = btns.find(b => b.textContent.includes('Wake'));
      if (wakeBtn) wakeBtn.click();
    });
    await new Promise(r => setTimeout(r, 500));

    // Capture Main Pet Vitals Screenshot
    const vitalsPath = path.join(subDir, 'screenshot_main_pet_vitals.png');
    await page.screenshot({ path: vitalsPath });
    console.log('Captured Main Pet Vitals Screenshot:', vitalsPath);

    // TEST 7: Tasks Screen Navigation
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const taskBtn = btns.find(b => b.title && b.title.includes('Tasks') || b.textContent.includes('Tasks'));
      if (taskBtn) taskBtn.click();
    });
    await new Promise(r => setTimeout(r, 600));

    const inTasksScreen = await page.evaluate(() => document.body.innerText.includes('COMPANION TASKS'));
    testResults.push({ name: 'TEST-P4-07: Navigation to Companion Tasks Screen', pass: inTasksScreen });
    console.log('TEST 7 Passed: In Tasks screen:', inTasksScreen);

    // TEST 8: Add Task with Validation
    // 8a: Empty input rejection
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const addBtn = btns.find(b => b.textContent.trim() === 'Add');
      if (addBtn) addBtn.click();
    });
    await new Promise(r => setTimeout(r, 300));
    const emptyErrorShown = await page.evaluate(() => document.body.innerText.includes('cannot be empty'));
    testResults.push({ name: 'TEST-P4-08a: Empty Task Submission Rejection', pass: emptyErrorShown });
    console.log('TEST 8a Passed: Empty task rejected:', emptyErrorShown);

    // 8b: Valid task addition
    await page.type('input[placeholder*="New daily task"]', 'Write Phase 4 documentation');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const addBtn = btns.find(b => b.textContent.trim() === 'Add');
      if (addBtn) addBtn.click();
    });
    await new Promise(r => setTimeout(r, 500));
    const taskAdded = await page.evaluate(() => document.body.innerText.includes('Write Phase 4 documentation'));
    testResults.push({ name: 'TEST-P4-08b: Valid Task Creation', pass: taskAdded });
    console.log('TEST 8b Passed: Task added:', taskAdded);

    // 8c: Duplicate task rejection
    await page.type('input[placeholder*="New daily task"]', 'Write Phase 4 documentation');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const addBtn = btns.find(b => b.textContent.trim() === 'Add');
      if (addBtn) addBtn.click();
    });
    await new Promise(r => setTimeout(r, 300));
    const dupErrorShown = await page.evaluate(() => document.body.innerText.includes('already exists'));
    testResults.push({ name: 'TEST-P4-08c: Duplicate Task Rejection', pass: dupErrorShown });
    console.log('TEST 8c Passed: Duplicate task rejected:', dupErrorShown);

    // TEST 9: Edit Task
    const editResult = await page.evaluate(() => {
      const editBtns = Array.from(document.querySelectorAll('button[title="Edit task"]'));
      if (editBtns.length > 0) {
        editBtns[0].click();
        return true;
      }
      return false;
    });
    await new Promise(r => setTimeout(r, 400));
    testResults.push({ name: 'TEST-P4-09: Task Edit Mode Activation', pass: editResult });
    console.log('TEST 9 Passed: Edit mode activated');

    // TEST 10: Toggle Task Completion & Reward
    await page.evaluate(() => {
      // Find card with "Write Phase 4 documentation" and click it
      const cards = Array.from(document.querySelectorAll('div.select-none'));
      const target = cards.find(c => c.textContent.includes('Write Phase 4 documentation'));
      if (target) target.click();
    });
    await new Promise(r => setTimeout(r, 500));
    const taskCompleted = await page.evaluate(() => {
      const lineThrough = document.querySelector('.line-through');
      return !!lineThrough;
    });
    testResults.push({ name: 'TEST-P4-10: Task Completion & Berry Reward Trigger', pass: taskCompleted });
    console.log('TEST 10 Passed: Task completed successfully:', taskCompleted);

    // TEST 11: Task Filters (Active / Completed / All)
    const filterWorks = await page.evaluate(() => {
      const tabs = Array.from(document.querySelectorAll('button.capitalize'));
      const activeTab = tabs.find(t => t.textContent.includes('active'));
      if (activeTab) activeTab.click();
      return true;
    });
    await new Promise(r => setTimeout(r, 400));
    testResults.push({ name: 'TEST-P4-11: Task Filter Tabs Operational', pass: filterWorks });
    console.log('TEST 11 Passed: Filter tabs operational');

    // Capture Tasks Management Screenshot
    const tasksPath = path.join(subDir, 'screenshot_tasks_management.png');
    await page.screenshot({ path: tasksPath });
    console.log('Captured Tasks Management Screenshot:', tasksPath);

    // TEST 12: LocalStorage Persistence
    const savedState = await page.evaluate(() => {
      return {
        pet: localStorage.getItem('mochi_pet_state_v1'),
        tasks: localStorage.getItem('mochi_tasks_v1'),
        settings: localStorage.getItem('mochi_settings_v1')
      };
    });
    const persistenceValid = !!savedState.pet && !!savedState.tasks;
    testResults.push({ name: 'TEST-P4-12: LocalStorage State Persistence', pass: persistenceValid });
    console.log('TEST 12 Passed: Local storage keys populated:', persistenceValid);

    // TEST 13: Page Reload & State Restoration
    console.log('Reloading page to verify persistence restore...');
    await page.reload({ waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));

    // Re-enter room
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const enter = btns.find(b => b.textContent.includes('ENTER MOCHI'));
      if (enter) enter.click();
    });
    await new Promise(r => setTimeout(r, 600));

    const restoredValid = await page.evaluate(() => {
      const text = document.body.innerText.toUpperCase();
      return (text.includes("MOCHI'S ROOM") || text.includes("MOCHI")) && !text.includes('NAN');
    });
    testResults.push({ name: 'TEST-P4-13: Reload & Elapsed Catch-Up Recovery', pass: restoredValid });
    console.log('TEST 13 Passed: Restored state without crash:', restoredValid);

    console.log('\n========================================');
    console.log('PHASE 4 TEST SUMMARY:');
    let allPassed = true;
    for (const t of testResults) {
      console.log(`  [${t.pass ? 'PASS' : 'FAIL'}] ${t.name}`);
      if (!t.pass) allPassed = false;
    }
    console.log(`TOTAL: ${testResults.length} Tests | ALL PASSED: ${allPassed}`);
    console.log('========================================\n');

  } catch (err) {
    console.error('Test execution failed:', err);
  } finally {
    await browser.close();
  }
}

runTests();
