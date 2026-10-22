# Flagship release report — 22 October 2026

Status: review candidates, not published products. All three redesigns are on dedicated `flagship/product-redesign` branches with draft pull requests. Published releases have not been changed. No Store upload, submission or publication was performed in this cycle.

## Exact candidate provenance

Build with `npm ci` then `npm run package` in `extension/` for Garage/YouTube, or the repository root for Logger. Use the commit below. These ZIPs are newly built flagship candidates, separate from the earlier 1.1.0/3.1.0/2.2.0 artifacts. Two consecutive local builds were byte-identical. ZIP integrity, manifest version and unchanged permission arrays were verified.

### YouTube-focus 3.2.0
- Source: `02596489cf4d19653a3c4735436ac8cef9111215`
- Review: [PR #6](https://github.com/flegardev/YouTube-focus/pull/6)
- CI: [run 39744305348](https://github.com/flegardev/YouTube-focus/actions/runs/39744305348)
- ZIP: `youtube-focus-mode-v3.2.0.zip` (22,603 bytes)
- SHA-256: `e2044af640a6169c572bc7ff8988c0e561337be9d37478747071ed0b3f085569`

### Avtonet-garage 1.2.0
- Source: `2fd94c8c7497708d835567b301b48debfc5adf82`
- Review: [PR #6](https://github.com/flegardev/Avtonet-garage/pull/6)
- CI: [run 39744298257](https://github.com/flegardev/Avtonet-garage/actions/runs/39744298257)
- ZIP: `avtonet-garaza-1.2.0.zip` (144,670 bytes)
- SHA-256: `24da55112a1eebc44ad5f5b836e832d0c060b778b8f533ff9aadf011c2aedf92`

### Auto-life-logger 2.3.0
- Source: `b71b40d4a60ebe5b9aef91b4c4056bc44094b56c`
- Review: [PR #4](https://github.com/flegardev/Auto-life-logger/pull/4)
- CI: [run 39744313336](https://github.com/flegardev/Auto-life-logger/actions/runs/39744313336)
- ZIP: `auto-life-logger-extension-2.3.0.zip` (74,727 bytes)
- SHA-256: `976a1e155b87cb0d29c04868759330196e5e0a387d7ef1f847183262ec92d85d`

## Automated and real-browser evidence

Local validation passed for all three. CI runs above execute the repository quality checks and actual extension journeys. The final CI status and package-hash comparison are recorded in CI_RESULTS.json. AvtoNet extension storage tests: 28 passed. Logger: 13 unit tests and 6 UI tests passed. YouTube: storage/overlay checks and 7 UI tests passed. Real-extension smoke and flagship journey scripts passed for every product.

The tests exercise fresh profiles, first-use states, primary and secondary flows, settings, errors and persistence through browser restart. YouTube covers keyboard session selection, named presets, pause/resume and automatic expiry. Garage covers launcher-to-workspace, comparison, persistent notes/checklist and malformed backup handling. Logger covers quiet setup, weekly review, goal persistence and navigation; existing smoke tests cover import deduplication and malformed backups. The coverage is targeted; it does not prove every possible control/state or full assistive-technology compatibility.

Final ZIPs were extracted and loaded into disposable profiles for upgrades. Garage and YouTube use the previously retrieved published-package files as baselines; Logger uses historical source because its published item is unverified. The same unpacked extension identity and seeded legacy storage values survived each upgrade. This is a fixture migration test, not a signed Chrome Web Store automatic-update test or exhaustive real-user dataset test.

A fresh unsigned-in live YouTube check passed: visible player, advancing playback and applied focus attributes. Evidence: live-checks/youtube-live.json. Live avto.net checks remain restricted by the site; fixture saving/parsing does not certify current live monitoring.

## Performance and visual evidence

PERFORMANCE.json contains five warm-reload samples per variant on Windows/headless Chromium. Median first-button readiness: YouTube 29 → 25 ms; Garage 34 → 25 ms; Logger 30 → 31 ms. Post-GC JavaScript heap: approximately 1.44 → 1.45 MB, 2.09 → 1.93 MB, 2.18 → 1.81 MB respectively. These are controlled local observations, not user-perceived cold startup, full browser-process memory or guarantees.

A 1,000-node YouTube fixture remained hidden and measured 16.55 → 15.13 ms of task time. Logger pure aggregation of 100,000 records took 5.34 ms; that result alone does not measure storage or rendering. A separate packaged-candidate run imported and retained 10,000 records: import 1,189 ms; dashboard review ready 302 ms; History navigation 1,807 ms including Playwright action waits; dashboard post-GC JS heap 3,296,596 bytes. See LARGE_HISTORY.json. Full 100,000-record browser/storage performance is still unverified.

Garage retains a webpack popup entrypoint warning around 255 KiB. The measured warm-start samples did not show a material regression; future code splitting should be measured against cold startup. Existing icons remain. Actual before/after screenshots and iteration findings are in BEFORE_AFTER.html and VISUAL_QA_REPORT.md. No full WCAG conformance or human-research claim is made.

## Store and launch gates

| Product | Previously observed published identity | Candidate upload | Submission | Publication |
|---|---|---|---|---|
| Garage | fgpcanlkfjelbccblfpgmobgfmahpiia; previously observed 1.0.4 | No | No | No |
| YouTube | feineenlljealpgoohilfdfmocmceohk; previously observed 3.0.3 | No | No | No |
| Logger | Unknown; historical source 2.1.1 is not proof of a published version | No | No | No |

The published versions above are baseline evidence from the earlier audit, not a fresh Store-dashboard verification on 22 October. Prior browser tooling rejected Store automation and native control could not establish the browser URL for policy enforcement. This cycle did not retry or bypass those restrictions.

Before publication: verify exact existing Store items and account access, resolve the Logger identity, validate current marketplace access, review Store disclosures and upload-size screenshots, complete a real five-person usability round and address primary-flow issues. The participant script is supplied; no participants were fabricated. Draft PRs remain separate from release/publication decisions.

Privacy remains local-first with no new analytics backend. Store materials, support links, launch strategy, research limitations and future opportunities are included in docs/flagship. Current policy references: [single purpose and quality](https://developer.chrome.com/docs/webstore/program-policies/quality-guidelines/) and [user-data disclosures](https://developer.chrome.com/docs/webstore/program-policies/user-data-faq). This report is not a Store approval or compliance certification.
