import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "playwright";

const rootDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputDir = path.join(rootDir, "_final_desktop_screenshots");
const viewport = { width: 1440, height: 900 };

const popupUrl = pathToFileURL(path.join(rootDir, "popup.html")).href;
const privacyUrl = pathToFileURL(path.join(rootDir, "privacy.html")).href;

fs.mkdirSync(outputDir, { recursive: true });

function installChromeMock(initialStore = {}) {
  const store = { ...initialStore };
  const listeners = new Set();

  globalThis.chrome = {
    runtime: {
      lastError: null
    },
    storage: {
      local: {
        get(defaults, callback) {
          const result = { ...defaults };
          for (const key of Object.keys(defaults)) {
            if (Object.prototype.hasOwnProperty.call(store, key)) {
              result[key] = store[key];
            }
          }
          callback(result);
        },
        set(payload, callback) {
          const changes = {};
          for (const [key, value] of Object.entries(payload)) {
            changes[key] = {
              oldValue: store[key],
              newValue: value
            };
            store[key] = value;
          }
          for (const listener of listeners) {
            listener(changes, "local");
          }
          callback?.();
        }
      },
      onChanged: {
        addListener(listener) {
          listeners.add(listener);
        },
        removeListener(listener) {
          listeners.delete(listener);
        }
      }
    },
    tabs: {
      create({ url }) {
        globalThis.__lastOpenedTab = url;
      }
    }
  };
}

function youtubeFixture() {
  return `<!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <title>YouTube Focus Mode Demo</title>
        <style>
          body { margin: 0; min-height: 100vh; font-family: Arial, sans-serif; background: #ffffff; }
          ytd-masthead, #masthead-container, ytd-page-manager { display: block; padding: 16px 24px; }
          ytd-page-manager { min-height: 100vh; background: #f9f9f9; color: #111111; }
        </style>
      </head>
      <body>
        <ytd-masthead>masthead</ytd-masthead>
        <div id="masthead-container">masthead container</div>
        <ytd-page-manager>
          <ytd-rich-item-renderer><a href="/shorts/demo">Shorts video</a></ytd-rich-item-renderer>
          <section>Home feed</section>
        </ytd-page-manager>
      </body>
    </html>`;
}

async function collectBrowserErrors(page) {
  const errors = [];
  page.on("console", (message) => {
    if (message.type() === "error") {
      errors.push(message.text());
    }
  });
  page.on("pageerror", (error) => errors.push(error.message));
  return errors;
}

async function capturePopup(browser) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  const errors = await collectBrowserErrors(page);

  await page.addInitScript(installChromeMock, {
    focusModeState: { focusEnabled: false, lockEnabled: false, lockEndTime: null },
    focusModeTheme: "light"
  });
  await page.goto(popupUrl);
  await page.getByRole("heading", { name: "Focus Mode" }).waitFor();
  await page.screenshot({
    path: path.join(outputDir, "01-main-dashboard-or-home.png"),
    fullPage: false
  });

  await context.close();
  return errors;
}

async function captureFocusedYoutube(browser) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  const errors = await collectBrowserErrors(page);

  await page.addInitScript(installChromeMock, {
    focusModeState: { focusEnabled: true, lockEnabled: false, lockEndTime: null },
    focusModeTheme: "light"
  });
  await page.route("https://www.youtube.com/**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "text/html",
      body: youtubeFixture()
    });
  });
  await page.goto("https://www.youtube.com/", { waitUntil: "domcontentloaded" });
  await page.addScriptTag({ path: path.join(rootDir, "storage.js") });
  await page.addScriptTag({ path: path.join(rootDir, "content.js") });
  await page.locator("#yt-focus-mode-placeholder").waitFor({ state: "visible" });
  await page.waitForTimeout(250);
  await page.screenshot({
    path: path.join(outputDir, "02-key-feature.png"),
    fullPage: false
  });

  await context.close();
  return errors;
}

async function captureSecondaryScreen(browser) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  const errors = await collectBrowserErrors(page);

  await page.goto(privacyUrl);
  await page.getByRole("heading", { name: "YouTube Focus Mode Privacy Policy" }).waitFor();
  await page.screenshot({
    path: path.join(outputDir, "03-detail-or-secondary-screen.png"),
    fullPage: false
  });

  await context.close();
  return errors;
}

const browser = await chromium.launch({ headless: true });
try {
  const allErrors = [
    ...(await capturePopup(browser)),
    ...(await captureFocusedYoutube(browser)),
    ...(await captureSecondaryScreen(browser))
  ];

  if (allErrors.length > 0) {
    throw new Error(`Browser errors while capturing screenshots:\n${allErrors.join("\n")}`);
  }

  for (const fileName of [
    "01-main-dashboard-or-home.png",
    "02-key-feature.png",
    "03-detail-or-secondary-screen.png"
  ]) {
    console.log(path.join(outputDir, fileName));
  }
} finally {
  await browser.close();
}
