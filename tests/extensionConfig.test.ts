import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";

function loadConfig() {
  const root: Record<string, unknown> = {};
  runInNewContext(readFileSync("extension/config.js", "utf8"), { globalThis: root });
  return root.YTFocusConfig as {
    DEFAULTS: Record<string, boolean>;
    normalize: (candidate: unknown) => Record<string, boolean>;
  };
}
describe("browser extension settings", () => {
  it("preserves valid toggles", () => {
    const config = loadConfig();
    expect(config.normalize({ hideComments: true, enabled: false })).toEqual({
      ...config.DEFAULTS, hideComments: true, enabled: false
    });
  });
  it("ignores invalid and unknown values", () => {
    const config = loadConfig();
    expect(config.normalize({ enabled: "false", admin: true })).toEqual(config.DEFAULTS);
    expect(config.normalize([])).toEqual(config.DEFAULTS);
    expect(config.normalize(null)).toEqual(config.DEFAULTS);
  });
});
