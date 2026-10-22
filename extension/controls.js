(() => {
  const labels = {
    home: 'Home recommendations',
    sidebar: 'Related videos',
    shorts: 'Shorts',
    comments: 'Comments',
    endscreens: 'End-screen suggestions',
    navigation: 'Search-and-watch navigation only'
  };
  const controls = document.getElementById('focus-controls');
  const status = document.getElementById('preferences-status');
  const preset = document.getElementById('focus-preset');
  let value = FocusPreferences.DEFAULTS;
  for (const [key, text] of Object.entries(labels)) {
    const label = document.createElement('label');
    label.className = 'preference-row';
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.dataset.preference = key;
    label.append(document.createTextNode(text), input);
    controls.append(label);
    input.addEventListener('change', () => save({
      ...value,
      [key]: input.checked
    }));
  }
  function render() {
    for (const input of controls.querySelectorAll('input')) input.checked = value[input.dataset.preference];
    const presets = {
      legacy: FocusPreferences.DEFAULTS,
      balanced: {
        home: true,
        sidebar: true,
        shorts: true,
        comments: false,
        endscreens: true,
        navigation: false
      },
      study: {
        ...FocusPreferences.DEFAULTS,
        navigation: false
      }
    };
    if (!preset.value.startsWith('saved-')) preset.value = Object.keys(presets).find(key => Object.keys(value).every(field => value[field] === presets[key][field])) || 'custom';
  }
  async function save(next) {
    for (const input of controls.querySelectorAll('input')) input.disabled = true;
    try {
      value = await FocusPreferences.set(next);
      preset.value = 'custom';
      status.textContent = 'Saved. Applied to open YouTube tabs.';
    } catch {
      status.textContent = 'Could not save. Your previous settings are still active.';
    } finally {
      document.getElementById('preset-delete').hidden = true;
      render();
      for (const input of controls.querySelectorAll('input')) input.disabled = false;
    }
  }
  preset.addEventListener('change', () => {
    const presets = {
      legacy: FocusPreferences.DEFAULTS,
      balanced: {
        home: true,
        sidebar: true,
        shorts: true,
        comments: false,
        endscreens: true,
        navigation: false
      },
      study: {
        ...FocusPreferences.DEFAULTS,
        navigation: false
      }
    };
    if (presets[preset.value]) save(presets[preset.value]);
  });
  FocusPreferences.get().then(next => {
    value = next;
    render();
  }).catch(() => {
    status.textContent = 'Could not load distraction controls. Reopen the popup to retry.';
  });
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && changes[FocusPreferences.KEY]) {
      value = FocusPreferences.normalize(changes[FocusPreferences.KEY].newValue);
      render();
    }
  });
})();

// Personal presets and temporary overrides use new keys; legacy state stays intact.
(() => {
  const status = document.getElementById('preferences-status');
  const preset = document.getElementById('focus-preset');
  const remove = document.getElementById('preset-delete');
  const pause = document.getElementById('pause-button');
  let saved = [],
    pauseUntil = 0,
    currentState = null;
  function options() {
    for (const option of preset.querySelectorAll('[data-saved]')) option.remove();
    for (const s of saved) {
      const option = document.createElement('option');
      option.value = s.id;
      option.textContent = s.name;
      option.dataset.saved = 'true';
      preset.append(option);
    }
  }
  preset.addEventListener('change', async () => {
    const entry = saved.find(s => s.id === preset.value);
    remove.hidden = !entry;
    if (entry) {
      try {
        await FocusPreferences.set(entry.value);
        status.textContent = 'Personal preset applied.';
      } catch {
        status.textContent = 'Could not apply this preset.';
      }
    }
  });
  document.getElementById('preset-save').addEventListener('click', async () => {
    const field = document.getElementById('preset-name'),
      name = field.value.trim();
    if (!name) {
      status.textContent = 'Give your preset a name first.';
      return;
    }
    if (saved.length >= 10) {
      status.textContent = 'You can save up to 10 presets. Delete one to make room.';
      return;
    }
    try {
      const next = [...saved, {
        id: `saved-${Date.now()}`,
        name: name.slice(0, 32),
        value: await FocusPreferences.get()
      }];
      await chrome.storage.local.set({
        focusModeSavedPresets: next
      });
      saved = next;
      options();
      preset.value = next[next.length - 1].id;
      remove.hidden = false;
      field.value = '';
      status.textContent = 'Personal preset saved on this device.';
    } catch {
      status.textContent = 'Preset could not be saved. Try again.';
    }
  });
  remove.addEventListener('click', async () => {
    try {
      const next = saved.filter(s => s.id !== preset.value);
      await chrome.storage.local.set({
        focusModeSavedPresets: next
      });
      saved = next;
      options();
      preset.value = 'custom';
      remove.hidden = true;
      status.textContent = 'Preset deleted. Your current view is unchanged.';
    } catch {
      status.textContent = 'Could not delete this preset.';
    }
  });
  for (const button of document.querySelectorAll('[data-tab]')) button.addEventListener('click', () => {
    for (const tab of document.querySelectorAll('[data-tab]')) tab.setAttribute('aria-pressed', String(tab === button));
    document.querySelector('.lock-panel').hidden = button.dataset.tab !== 'session';
    document.querySelector('[aria-label="Distraction controls"]').hidden = button.dataset.tab !== 'view';
  });
  document.getElementById('welcome-dismiss').addEventListener('click', async () => {
    try {
      await chrome.storage.local.set({
        focusModeOnboarded: true
      });
      document.getElementById('onboarding').hidden = true;
    } catch {
      status.textContent = 'Could not save your welcome preference.';
    }
  });
  function renderPause() {
    const active = pauseUntil > Date.now();
    const locked = currentState && FocusModeStorage.isLocked(currentState);
    pause.disabled = Boolean(locked);
    pause.textContent = locked ? 'Pause unavailable during lock' : active ? 'Resume hiding now' : 'Pause hiding for 5 minutes';
    document.getElementById('pause-status').textContent = active ? `Hiding resumes at ${new Date(pauseUntil).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    })}. Your preferences are preserved.` : '';
  }
  const pauseClock = window.setInterval(renderPause, 1000);
  window.addEventListener('unload', () => window.clearInterval(pauseClock));
  pause.addEventListener('click', async () => {
    try {
      const state = await FocusModeStorage.getState();
      if (FocusModeStorage.isLocked(state)) {
        status.textContent = 'Temporary pause is unavailable during your voluntary focus lock.';
        return;
      }
      const next = pauseUntil > Date.now() ? 0 : Date.now() + 300000;
      await chrome.storage.local.set({
        focusModePauseUntil: next
      });
      pauseUntil = next;
      renderPause();
    } catch {
      status.textContent = 'Could not change the pause. Try again.';
    }
  });
  chrome.storage.local.get(['focusModeSavedPresets', 'focusModeOnboarded', 'focusModeState', 'focusModePauseUntil'], data => {
    if (chrome.runtime.lastError) {
      status.textContent = 'Could not load personal presets.';
      return;
    }
    saved = (Array.isArray(data.focusModeSavedPresets) ? data.focusModeSavedPresets : []).filter(s => s && typeof s.id === 'string' && typeof s.name === 'string').slice(0, 10).map(s => ({
      ...s,
      name: s.name.slice(0, 32),
      value: FocusPreferences.normalize(s.value)
    }));
    currentState = data.focusModeState || null;
    pauseUntil = Number(data.focusModePauseUntil) || 0;
    options();
    renderPause();
    document.getElementById('onboarding').hidden = Boolean(data.focusModeOnboarded || data.focusModeState);
  });
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && changes.focusModeState) {
      currentState = changes.focusModeState.newValue || null;
      renderPause();
    }
    if (area === 'local' && changes.focusModePauseUntil) {
      pauseUntil = Number(changes.focusModePauseUntil.newValue) || 0;
      renderPause();
    }
  });
})();
