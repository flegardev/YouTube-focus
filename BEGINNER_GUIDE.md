# 🎓 YouTube Focus Mode — Beginner's Learning Guide

## What This Project Does
**youtube-focus** is a distraction-free YouTube productivity engine and focus session platform built with strict TypeScript, Zod schema validation, and reactive session state management.

---

## 🗺️ Architecture Map

```
CORE DOMAIN & TYPES
  │  (src/types/focus.ts - Session Configuration, Zod Validation Schemas)
  ▼
FOCUS ENGINE & BUSINESS LOGIC
  │  (src/services/focusEngine.ts - Strict Pure State Transitions, Distraction Calculation)
  ▼
REACTIVE HOOKS & UI COMPONENTS
  │  ├── useFocusSession (src/hooks/useFocusSession.ts)
  │  ├── FocusTimer (src/components/FocusTimer.tsx)
  │  └── DistractionMetricsCard (src/components/DistractionMetricsCard.tsx)
  ▼
UNIT TEST & VERIFICATION SUITE
     (tests/focusEngine.test.ts - Vitest Session Lifecycle & Invariant Tests)
```

---

## 🎯 Core Files to Study First (Recommended Learning Order)

1. [`src/types/focus.ts`](file:///C:/Users/tinif/repos/youtube-focus/src/types/focus.ts)
   - **Why study first**: Shows how to use TypeScript interfaces and Zod schemas to model strict invariants (focus durations, distraction block rules).
2. [`src/services/focusEngine.ts`](file:///C:/Users/tinif/repos/youtube-focus/src/services/focusEngine.ts)
   - **Why study next**: Teaches pure state machine transitions for starting, pausing, completing, and tracking focus intervals.
3. [`tests/focusEngine.test.ts`](file:///C:/Users/tinif/repos/youtube-focus/tests/focusEngine.test.ts)
   - **Why study third**: Demonstrates clean unit testing of time-based domain logic using Vitest.

---

## 🛠️ How to Run & Verify

1. **Run Unit Tests**:
   ```bash
   npm test
   ```
2. **Typecheck Codebase**:
   ```bash
   npm run typecheck
   ```
