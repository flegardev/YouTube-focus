// CSS controls survive YouTube client-side navigation without DOM rewrites.
(function () {
  "use strict";
  const config = globalThis.YTFocusConfig;
  const selectors = [
    'html[data-yf-enabled="1"][data-yf-home="1"] ytd-browse[page-subtype="home"] #contents { display:none !important; }',
    'html[data-yf-enabled="1"][data-yf-recommendations="1"] ytd-watch-next-secondary-results-renderer { display:none !important; }',
    'html[data-yf-enabled="1"][data-yf-shorts="1"] ytd-reel-shelf-renderer, html[data-yf-enabled="1"][data-yf-shorts="1"] ytd-rich-shelf-renderer[is-shorts], html[data-yf-enabled="1"][data-yf-shorts="1"] ytd-guide-entry-renderer a[href^="/shorts"], html[data-yf-enabled="1"][data-yf-shorts="1"] ytd-mini-guide-entry-renderer a[href^="/shorts"] { display:none !important; }',
    'html[data-yf-enabled="1"][data-yf-comments="1"] ytd-comments#comments { display:none !important; }',
    'html[data-yf-enabled="1"][data-yf-endscreens="1"] .ytp-ce-element { display:none !important; }'
  ];
  const style = document.createElement("style");
  style.id = "youtube-focus-mode-styles";
  style.textContent = selectors.join("\n");
  document.documentElement.appendChild(style);
  function apply(value) {
    const state = config.normalize(value);
    const attrs = {
      "data-yf-enabled": state.enabled,
      "data-yf-home": state.hideHomeFeed,
      "data-yf-recommendations": state.hideRecommendations,
      "data-yf-shorts": state.hideShorts,
      "data-yf-comments": state.hideComments,
      "data-yf-endscreens": state.hideEndScreens
    };
    for (const [key, enabled] of Object.entries(attrs)) {
      document.documentElement.setAttribute(key, enabled ? "1" : "0");
    }
  }
  apply(config.DEFAULTS);
  chrome.storage.sync.get(config.DEFAULTS).then(apply).catch(() => apply(config.DEFAULTS));
  chrome.storage.onChanged.addListener((_changes, area) => {
    if (area !== "sync") return;
    chrome.storage.sync.get(config.DEFAULTS).then(apply).catch(() => {});
  });
})();
