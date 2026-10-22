# Visual QA report — 22 October 2026

Actual extension pages were rendered in isolated Chromium profiles. Screenshots use synthetic data, never private browsing history. The before views are labeled in the gallery; they show the prior candidate UI, not a claim that those candidates were published. No generated mockup substitutes for product rendering.

## AvtoNetGaraža 1.2.0

Reviewed: compact launcher, full-tab garage, comparison, vehicle detail and notes, folders, notification empty state and settings/error recovery. See screenshots/avtonet-*-after.png.

The old popup crammed the garage into limited space. The new 380px launcher opens a full-tab workspace. Comparison differences have text labels and asking-price gaps; notes and a purchase checklist belong to the vehicle detail. An early pass retained low-contrast gradient buttons; these were replaced with solid orange controls and dark text. Malformed backup JSON originally exposed an unhelpful English parser error; it now produces a wrapped Slovenian explanation. Settings and notifications now qualify marketplace checks on access being available.

Final inspection: headings and controls are readable, folder rows align, empty states explain the next state, and detail controls fit the dialog. Missing listing photos intentionally exercise the fallback. The large workspace leaves room for a real shortlist; empty secondary sections do not invent data. Browser-native file-input wording follows browser locale. Live marketplace behavior remains restricted and is not certified by these screenshots.

## YouTube Focus Mode 3.2.0

Reviewed: first-run view, compact configured view, expanded granular controls, focus session and dark appearance. See screenshots/youtube-*-after.png.

The first redesign was too tall with every setting exposed. Granular controls and preset naming now use disclosures; the main configured view fits a 380px by 600px viewport. The switch leads the hierarchy, with view/session tabs separating tasks. Named presets and the five-minute pause have visible status. Keyboard timer selection exposed a stale Start label; rendering was corrected and tested. A final pass found that Pause still looked actionable during a voluntary lock; it now shows an explicit unavailable label and is disabled, with a browser regression assertion.

Final inspection: compact view has clear hierarchy and readable controls; dark session view remains legible. Expanded advanced controls can scroll. No time-saved claims or unsupported classification are shown.

## Auto Life Logger 2.3.0

Reviewed: weekly overview, Sites, Patterns, Score details, Milestones, Reports, History, Settings, popup, onboarding and options. See screenshots/logger-*-after.png.

The first light-theme pass retained dark gradients and faint chart text. These were replaced with light surfaces and darker labels. The weekly review and popup now lead with recorded time, not a productivity score. Quiet onboarding is available before detailed configuration. Score details describe a rule-based estimate; milestone thresholds no longer label a day good or bad.

Screenshot review caught apparently empty Sites and achievement panels plus a stale navigation highlight. DOM assertions confirmed populated content; finite animations were captured before completion by headless Chromium. Capture now finishes animations and asserts the selected section and seeded Sites data. The repeated screenshots show populated rows, unlocked/locked achievement states and the correct highlighted section. This was a capture defect, not evidence that empty screenshots were acceptable.

Final inspection: the dashboard has consistent readable type, aligned panels, labeled charts, quiet colors and explicit empty states. Secondary legacy score/milestone features remain and are less central; some historical achievement wording is still motivational rather than analytical. Reports are shown honestly empty until generated.

## Coverage and limits

Keyboard interactions, native labels, visible focus styles, responsive layouts and reduced-motion styles have targeted coverage. This is not a complete WCAG 2.2 AA conformance audit. Screen-reader testing with assistive technology and genuine five-person usability sessions remain outstanding. Public competitor-page captures are research evidence, not signed-in product audits. Review performance methodology in PERFORMANCE.json and the release report before interpreting timings.
