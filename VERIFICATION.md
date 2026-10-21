# Verification on 2026-10-21

Candidate 3.1.0, previous 3.0.3.

- Static validation/lint: passed.
- Unit and UI checks: 7 module tests; published-storage regression script; 10 overlay assertions; 7 Playwright UI tests, passed.
- Browser: Real extension six-control tests, dynamic Shorts insertions, SPA routes, restart persistence and retained soft lock/theme passed.
- Upgrade fixture: old extension files replaced in the same disposable-profile path; identity and seeded data retained.
- Dependency audit: zero findings in each package root as checked locally.
- Manifest asset existence: passed.
- Store upload, submission and publication: not performed.
- Live marketplace variations and full YouTube playback: not verified by offline fixtures.
- CI: see the current PR checks; local checks do not imply hosted CI passed.

The actual published CRX was retrieved from Google on 2026-10-21. SHA256: `3f1bd34cedcdf3c3d7916fefb7ebee0cf70ba094ffb770063cc211b272a2a514`. Historical source: `refs/pull/1/head`. All YouTube runtime source files matched the published package after line-ending normalization.
