(function () {
  "use strict";
  const config = globalThis.YTFocusConfig;
  const status = document.getElementById("status");
  const fields = Array.from(document.querySelectorAll("input[data-key]"));
  let settings = config.normalize(config.DEFAULTS);
  function render() {
    for (const field of fields) field.checked = settings[field.dataset.key];
  }
  async function load() {
    try {
      settings = config.normalize(await chrome.storage.sync.get(config.DEFAULTS));
      render();
    } catch {
      render();
      status.textContent = "Could not load saved settings.";
    }
  }
  fields.forEach((field) => field.addEventListener("change", async () => {
    const previous = settings;
    settings = config.normalize({ ...settings, [field.dataset.key]: field.checked });
    render();
    try {
      await chrome.storage.sync.set(settings);
      status.textContent = "Saved. YouTube updates instantly.";
    } catch {
      settings = previous;
      render();
      status.textContent = "Save failed. Please try again.";
    }
  }));
  document.getElementById("open").addEventListener("click", () => {
    chrome.tabs.create({ url: "https://www.youtube.com/" });
  });
  void load();
})();
