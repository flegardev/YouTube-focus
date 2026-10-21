(() => {
  const KEY = 'focusModePreferences';
  const DEFAULTS = Object.freeze({ home: true, sidebar: true, shorts: true, comments: true, endscreens: true, navigation: true });
  const normalize = value => Object.fromEntries(Object.entries(DEFAULTS).map(([k, v]) => [k, typeof value?.[k] === 'boolean' ? value[k] : v]));
  const get = () => new Promise((resolve, reject) => chrome.storage.local.get({ [KEY]: DEFAULTS }, data => chrome.runtime.lastError ? reject(new Error(chrome.runtime.lastError.message)) : resolve(normalize(data[KEY]))));
  const set = value => new Promise((resolve, reject) => { const next = normalize(value); chrome.storage.local.set({ [KEY]: next }, () => chrome.runtime.lastError ? reject(new Error(chrome.runtime.lastError.message)) : resolve(next)); });
  globalThis.FocusPreferences = { KEY, DEFAULTS, normalize, get, set };
})();
