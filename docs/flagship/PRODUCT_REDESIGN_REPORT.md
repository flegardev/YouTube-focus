# Flagship product redesign

This cycle implements new workflows and interface architecture in all three extensions. It is not a claim of product-market fit or completed Store deployment. Research, screenshots, executable tests and release evidence accompany the code.

## AvtoNetGaraža

**Reason to choose it:** a private, Slovenian-language decision workspace connected to an avto.net shortlist. A buyer can retain questions, compare asking prices and keep manual ownership records without an account.

The toolbar popup is now a compact launcher with a clear three-step saving guide. The garage opens in a full browser tab with a larger grid, folder navigation and comparison workspace. Comparison marks differing rows with text as well as color and shows the difference from the lowest selected asking price. This is arithmetic on saved listings, not a market valuation.

Each vehicle has persistent personal notes and four purchase-checklist items. Re-saving a listing preserves them. Backup recovery validates the input before writing and adds missing vehicles, folders and their ownership records without replacing current vehicles or settings. Malformed JSON produces a useful Slovenian explanation. Existing expenses, service date, price history, folder management and on-page save functionality remain.

Live avto.net access was restricted in the prior live check. Fixtures verify parsing and the injected save path; they do not prove current unrestricted marketplace monitoring. Photography remains supplied by actual saved listing URLs; test screenshots deliberately exercise unavailable-image states rather than pretending stock images are live cars.

## YouTube Focus Mode

**Reason to choose it:** a small, reversible viewing-control tool whose common actions are choosing a mode and switching Focus on.

The popup has separate view/session tabs, a restrained green identity, clear state, collapsible granular controls and light/dark appearances. First-run guidance explains local preferences. Built-in modes remain; up to ten personal named presets can now be saved, applied and deleted. A five-minute pause restores YouTube temporarily without deleting the chosen hiding preferences, and resumes automatically. Voluntary locks override the pause.

Timer keyboard navigation now updates the start button immediately; the previous implementation left its label stale. Existing search/playback routes, dynamic CSS hiding, SPA navigation and legacy three-field state remain. No fake time-saved counter, category blocking or guaranteed behavior under all YouTube experiments is claimed.

## Auto Life Logger

**Reason to choose it:** an account-free browser review with transparent calculations and local history.

The dashboard is redesigned around a seven-day recorded-time review and a user-chosen daily goal. The review explicitly says it covers browser activity only and that productive labels come from domain rules. Zero-data and recorded-data states use the same understandable structure. Day bars include numeric labels and accessible date/duration descriptions. The popup leads with recorded time and labeled categories, replacing the prominent score/streak presentation. Existing score and milestone pages remain available.

The quiet onboarding path saves setup with browser alerts, interventions and strict blocking off. Users can still configure all existing rules. Chart label contrast was corrected for the new light palette. Overview aggregation no longer counts overlapping productive/distracting flags twice. A pure seven-day aggregation test covers date boundaries and malformed durations.

Historical category flags retain their capture-time meaning; changing domain lists does not retroactively rewrite raw history. The new goal is not a judgment of work quality. This cycle does not establish full 100,000-record import/dashboard performance merely because the pure aggregation is fast.

## Design systems

All three retain local assets and system fonts, avoiding font network requests. Spacing uses 4/8/12/16/24/32-pixel steps; controls use visible focus outlines and native form semantics. Reduced motion disables decorative transitions.

| Product | Typography / palette | Components and layout |
|---|---|---|
| Garage | Segoe UI/system; 30px workspace heading, 22px brand, 14px body; graphite `#10161c`, surface `#182129`, text `#f0f3f5`, orange `#ffad70` | 380px launcher; full-tab responsive grid; 200px folder rail; 6–10px corners; understated borders; dialog focus containment; semantic status colors |
| YouTube | Segoe UI/system; 21px title, 14px groups, 12–13px controls; near-white `#f6f7f8`, ink `#1b2229`, green `#17644e`; explicit dark tokens | 380px popup; master switch; two tabs; native disclosure controls; preset select; 6–12px corners; short switch transition |
| Logger | Segoe UI/system; 30px page title, 24px review total, 13–14px body; `#f3f5f8`, white surfaces, ink `#202d42`, blue `#315cab` | Dashboard rail, review bars, secondary charts, quiet onboarding, compact popup; 6–12px corners; numeric chart labels; reduced animation |

Existing icons were retained for recognition. A new illustration or mock screenshot was not substituted for actual product rendering. WCAG 2.2 AA remains the target; targeted keyboard, labeling, contrast and responsive checks are not a full conformance audit.

## Human validation still needed

No genuine participants were available. The supplied five-person test script is ready to run. Claims about voluntary installation, retention and recommendation remain hypotheses until observed with real users.
