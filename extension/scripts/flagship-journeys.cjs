const {
  chromium,
  expect
} = require('@playwright/test');
const fs = require('node:fs'),
  path = require('node:path'),
  os = require('node:os'),
  assert = require('node:assert/strict');
const out = path.resolve(__dirname, '../output/playwright/flagship');
const results = [];
fs.mkdirSync(out, {
  recursive: true
});
async function launch(dir, profile) {
  const context = await chromium.launchPersistentContext(profile, {
    headless: true,
    executablePath: process.env.EXTENSION_CHROMIUM,
    channel: process.env.EXTENSION_CHROMIUM ? undefined : 'chromium',
    viewport: {
      width: 1280,
      height: 900
    },
    args: [`--disable-extensions-except=${dir}`, `--load-extension=${dir}`]
  });
  const index = await context.newPage();
  await index.goto('chrome://extensions');
  await index.locator('extensions-item').first().waitFor();
  const id = await index.locator('extensions-item').first().getAttribute('id');
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  return {
    context,
    page,
    id,
    errors
  };
}
async function shot(page, name) {
  await page.waitForTimeout(350);
  await page.screenshot({
    path: path.join(out, name + '.png'),
    fullPage: true
  });
}
async function measure(page) {
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Performance.enable');
  const samples = [];
  for (let i = 0; i < 5; i++) {
    await page.reload();
    await page.waitForTimeout(150);
    samples.push(await page.evaluate(() => globalThis.performance.getEntriesByType('navigation')[0].domContentLoadedEventEnd));
  }
  const metrics = await cdp.send('Performance.getMetrics');
  await cdp.detach();
  return {
    domContentLoadedMs: samples,
    medianMs: samples.sort((a, b) => a - b)[2],
    metrics: Object.fromEntries(metrics.metrics.filter(m => ['JSHeapUsedSize', 'Nodes', 'TaskDuration'].includes(m.name)).map(m => [m.name, m.value]))
  };
}
async function youtube() {
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'flagship-yt-'));
  let run = await launch(path.resolve(__dirname, '..'), profile);
  let {
    context,
    page,
    id
  } = run;
  try {
    await page.setViewportSize({
      width: 380,
      height: 600
    });
    await page.goto(`chrome-extension://${id}/popup.html`);
    await expect(page.locator('#onboarding')).toBeVisible();
    await page.getByRole('button', {
      name: 'Got it',
      exact: true
    }).click();
    await page.getByRole('switch').click();
    await page.getByLabel('Focus preset').selectOption('balanced');
    await page.locator('.granular-controls summary').click();
    await page.locator('.save-preset summary').click();
    await page.getByLabel('Preset name').fill('Evening learning');
    await page.getByRole('button', {
      name: 'Save preset',
      exact: true
    }).click();
    await expect(page.locator('#preferences-status')).toContainText('Personal preset saved');
    await page.getByLabel('Comments', {
      exact: true
    }).check();
    const savedId = await page.locator('option[data-saved]').getAttribute('value');
    await page.getByLabel('Focus preset').selectOption(savedId);
    await expect(page.getByLabel('Comments', {
      exact: true
    })).not.toBeChecked();
    await page.locator('.save-preset summary').click();
    await shot(page, 'youtube-view-after');
    await page.locator('.granular-controls summary').click();
    await shot(page, 'youtube-compact-after');
    const yt = await context.newPage();
    await context.route('https://www.youtube.com/**', r => r.fulfill({
      contentType: 'text/html',
      body: '<html><body><ytd-page-manager><video id="player"></video><ytd-comments>Comments</ytd-comments><div id="secondary">Related videos</div></ytd-page-manager></body></html>'
    }));
    await yt.goto('https://www.youtube.com/watch?v=fixture');
    await expect(yt.locator('#secondary')).toBeHidden();
    await page.getByRole('button', {
      name: 'Pause hiding for 5 minutes'
    }).click();
    await expect(yt.locator('#secondary')).toBeVisible();
    await page.getByRole('button', {
      name: 'Resume hiding now'
    }).click();
    await expect(yt.locator('#secondary')).toBeHidden();
    await page.evaluate(() => chrome.storage.local.set({
      focusModePauseUntil: Date.now() + 800
    }));
    await expect(yt.locator('#secondary')).toBeVisible();
    await expect(yt.locator('#secondary')).toBeHidden();
    await page.getByRole('button', {
      name: 'Focus session',
      exact: true
    }).click();
    await page.getByRole('radio', {
      name: '25m',
      exact: true
    }).focus();
    await page.keyboard.press('ArrowRight');
    await page.getByRole('button', {
      name: 'Start 50m soft lock'
    }).click();
    await expect(page.getByRole('switch')).toBeDisabled();
    await expect(page.getByRole('button', { name: 'Pause unavailable during lock' })).toBeDisabled();
    await shot(page, 'youtube-session-after');
    await page.getByRole('button', {
      name: 'Toggle theme'
    }).click();
    await shot(page, 'youtube-dark-after');
    const performance = await measure(page);
    assert.deepEqual(run.errors, []);
    await context.close();
    run = await launch(path.resolve(__dirname, '..'), profile);
    ({
      context,
      page,
      id
    } = run);
    await page.goto(`chrome-extension://${id}/popup.html`);
    await expect(page.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
    assert.equal((await page.evaluate(() => chrome.storage.local.get('focusModeSavedPresets'))).focusModeSavedPresets[0].name, 'Evening learning');
    results.push({
      product: 'YouTube Focus',
      passed: true,
      performance
    });
  } finally {
    await context.close();
  }
}
youtube().then(() => {
  fs.writeFileSync(path.join(out, 'journeys.json'), JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
}).catch(e => {
  console.error(e);
  process.exitCode = 1;
});
