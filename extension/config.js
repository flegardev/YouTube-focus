(function (root) {
  "use strict";
  const DEFAULTS = Object.freeze({
    enabled: true, hideHomeFeed: true, hideRecommendations: true,
    hideShorts: true, hideComments: false, hideEndScreens: true
  });
  function normalize(value) {
    const candidate = value && typeof value === "object" && !Array.isArray(value) ? value : {};
    const result = {};
    for (const [key, fallback] of Object.entries(DEFAULTS)) {
      result[key] = typeof candidate[key] === "boolean" ? candidate[key] : fallback;
    }
    return result;
  }
  root.YTFocusConfig = Object.freeze({ DEFAULTS, normalize });
})(globalThis);
