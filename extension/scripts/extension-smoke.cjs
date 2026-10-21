// Integration tests use fresh disposable Chromium profiles and real Chrome APIs.
const { chromium, expect } = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const artifacts = path.join(root, 'output', 'playwright'); fs.mkdirSync(artifacts, { recursive:true });
const browserPath = process.env.EXTENSION_CHROMIUM;
const errors = [];
async function launch(extensionPath, profile) {
  const context = await chromium.launchPersistentContext(profile, {
    headless:true, channel: browserPath ? undefined : 'chromium', executablePath:browserPath,
    viewport:{ width:1280,height:900 },
    args:[`--disable-extensions-except=${extensionPath}`,`--load-extension=${extensionPath}`]
  });
  const page = await context.newPage();
  await page.goto('chrome://extensions');
  const item = page.locator('extensions-item').first();
  await item.waitFor({ timeout:15000 });
  const id = await item.getAttribute('id'); assert.match(id,/^[a-p]{32}$/);
  const popup = await context.newPage();
  popup.on('pageerror', e => errors.push(e.message));
  await popup.goto(`chrome-extension://${id}/popup.html`);
  return { context, page:popup, id };
}
async function youtube() {
  const dir = root;
  const profile = fs.mkdtempSync(path.join(os.tmpdir(),'yt-focus-qa-'));
  let { context,page } = await launch(dir, profile);
  try {
    await page.setViewportSize({width:380,height:600});
    await expect(page.getByRole('switch')).toHaveAttribute('aria-checked','false');
    // Same local key and canonical three-field shape as the actual 3.0.3 package.
    await page.evaluate(() => chrome.storage.local.set({focusModeState:{focusEnabled:true,lockEnabled:false,lockEndTime:null},focusModeTheme:'dark'}));
    await page.reload(); await expect(page.getByRole('switch')).toHaveAttribute('aria-checked','true');
    await expect(page.locator('body')).toHaveAttribute('data-theme','dark');
    const yt = await context.newPage(); yt.on('pageerror',e=>errors.push(e.message));
    await context.route('https://www.youtube.com/**',route=>route.fulfill({contentType:'text/html',body:'<!doctype html><html><body><ytd-page-manager><h1>Fixture video</h1><video id="player"></video><ytd-comments id="comments">Comments</ytd-comments><div id="secondary"><ytd-watch-next-secondary-results-renderer>Next</ytd-watch-next-secondary-results-renderer></div><div class="ytp-ce-element">End card</div><ytd-rich-item-renderer><a href="/shorts/test">Short</a></ytd-rich-item-renderer></ytd-page-manager></body></html>'}));
    await yt.goto('https://www.youtube.com/watch?v=fixture');
    await expect(yt.locator('#comments')).toBeHidden();
    await expect(yt.locator('#secondary')).toBeHidden();
    await expect(yt.locator('#player')).toBeVisible();
    await page.getByLabel('Focus preset').selectOption('balanced');
    await expect(yt.locator('#comments')).toBeVisible();
    await expect(yt.locator('.ytp-ce-element')).toBeHidden();
    await yt.evaluate(() => {
      const home=document.createElement('ytd-browse');home.setAttribute('page-subtype','home');home.innerHTML='<ytd-rich-grid-renderer id="home-cards">Fixture recommendations</ytd-rich-grid-renderer>';document.body.append(home);
    });
    for (const [label, selector] of [['Home recommendations','#home-cards'],['Related videos','#secondary'],['Shorts','ytd-rich-item-renderer'],['End-screen suggestions','.ytp-ce-element']]) {
      await expect(yt.locator(selector).first()).toBeHidden();
      await page.getByLabel(label,{exact:true}).uncheck();
      await expect(yt.locator(selector).first()).toBeVisible();
      await page.getByLabel(label,{exact:true}).check();
      await expect(yt.locator(selector).first()).toBeHidden();
    }
    await yt.evaluate(() => { history.pushState({},'', '/@fixture'); window.dispatchEvent(new Event('yt-navigate-finish')); });
    await expect(yt.locator('#yt-focus-mode-placeholder')).toBeHidden();
    await page.getByLabel('Search-and-watch navigation only',{exact:true}).check();
    await expect(yt.locator('#yt-focus-mode-placeholder')).toBeVisible();
    await page.getByLabel('Search-and-watch navigation only',{exact:true}).uncheck();
    await expect(yt.locator('#yt-focus-mode-placeholder')).toBeHidden();
    await yt.evaluate(() => { const el=document.createElement('ytd-rich-item-renderer'); el.id='inserted-shorts'; el.innerHTML='<a href="/shorts/new">New Short</a>';document.body.append(el); });
    await expect(yt.locator('#inserted-shorts')).toBeHidden();
    await page.getByLabel('Comments',{exact:true}).check();
    await expect(yt.locator('#comments')).toBeHidden();
    await page.getByRole('switch').click(); await expect(yt.locator('#comments')).toBeVisible();
    await page.keyboard.press('Tab'); assert.ok(await page.evaluate(()=>document.activeElement !== document.body));
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth));
    await page.screenshot({path:path.join(artifacts,'youtube-after.png'),fullPage:true});
    await page.getByRole('switch').click();
    await page.getByRole('button',{name:'Start 25m soft lock'}).click();
    await expect(page.getByRole('switch')).toBeDisabled();
    const state=await page.evaluate(()=>chrome.storage.local.get(null));
    assert.deepEqual(Object.keys(state.focusModeState).sort(),['focusEnabled','lockEnabled','lockEndTime']);
    await context.close();
    ({context,page}=await launch(dir,profile));
    await expect(page.getByRole('switch')).toBeDisabled();
    await expect(page.locator('body')).toHaveAttribute('data-theme','dark');
    console.log('PASS YouTube: real extension APIs, legacy state, 6 controls, dynamic DOM, route event, playback element, soft lock, restart persistence, keyboard and width');
  } finally { await context.close(); }
}

youtube().then(()=>{ assert.deepEqual(errors,[]); }).catch(e=>{ console.error(e); process.exitCode=1; });
