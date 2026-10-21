(() => {
  const labels = { home: 'Home recommendations', sidebar: 'Related videos', shorts: 'Shorts', comments: 'Comments', endscreens: 'End-screen suggestions', navigation: 'Search-and-watch navigation only' };
  const controls = document.getElementById('focus-controls');
  const status = document.getElementById('preferences-status');
  const preset = document.getElementById('focus-preset');
  let value = FocusPreferences.DEFAULTS;
  for (const [key, text] of Object.entries(labels)) {
    const label = document.createElement('label'); label.className = 'preference-row';
    const input = document.createElement('input'); input.type = 'checkbox'; input.dataset.preference = key;
    label.append(document.createTextNode(text), input); controls.append(label);
    input.addEventListener('change', () => save({ ...value, [key]: input.checked }));
  }
  function render() { for (const input of controls.querySelectorAll('input')) input.checked = value[input.dataset.preference]; }
  async function save(next) {
    for (const input of controls.querySelectorAll('input')) input.disabled = true;
    try { value = await FocusPreferences.set(next); preset.value = 'custom'; status.textContent = 'Saved. Applied to open YouTube tabs.'; }
    catch { status.textContent = 'Could not save. Your previous settings are still active.'; }
    finally { render(); for (const input of controls.querySelectorAll('input')) input.disabled = false; }
  }
  preset.addEventListener('change', () => {
    const presets = { legacy: FocusPreferences.DEFAULTS, balanced: { home:true, sidebar:true, shorts:true, comments:false, endscreens:true, navigation:false }, study: { ...FocusPreferences.DEFAULTS, navigation:false } };
    if (presets[preset.value]) save(presets[preset.value]);
  });
  FocusPreferences.get().then(next => { value = next; render(); }).catch(() => { status.textContent = 'Could not load distraction controls. Reopen the popup to retry.'; });
  chrome.storage.onChanged.addListener((changes, area) => { if (area === 'local' && changes[FocusPreferences.KEY]) { value = FocusPreferences.normalize(changes[FocusPreferences.KEY].newValue); render(); } });
})();
