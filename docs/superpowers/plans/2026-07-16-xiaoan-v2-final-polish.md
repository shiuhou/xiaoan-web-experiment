# Xiao-An V2 Final Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn Signal and Edge into screenshot-worthy middle acts while preserving the current six-act architecture, Hero-only WebGL, accessibility fallbacks, and branch isolation.

**Architecture:** Keep the existing React act components and GSAP ScrollTrigger timelines. Add one semantic DOM layer to Signal, express the visual reconstruction in the existing V2 stylesheets, and extend source-contract tests so global scrollbar, Reduced Motion, and hardware-integration guarantees remain explicit.

**Tech Stack:** Next.js 16, React 19, TypeScript, GSAP/ScrollTrigger, CSS, Vitest, Testing Library, Playwright-based browser QA.

## Global Constraints

- Keep WebGL Hero-only; do not add a Canvas to Signal or Edge.
- Do not modify or replace source images in `public/assets/v2`.
- Do not add remote assets, external fonts, product metrics, APIs, or generated robot imagery.
- Preserve wheel, touch, keyboard, and programmatic scrolling; do not add scroll snap or wheel interception.
- Reduced Motion must show final readable states without flashes, pinning, or hidden semantic content.
- Work only on `feature/visual-overhaul-v2`; do not merge into or modify `0703`.

---

### Task 1: Signal compression chamber

**Files:**
- Modify: `src/components/acts/signal-act.test.tsx`
- Modify: `src/components/acts/signal-act.tsx`
- Modify: `src/components/motion/signal-timeline.ts`
- Modify: `src/styles/v2/signal.css`

**Interfaces:**
- Consumes: existing `[data-signal-kind]`, `[data-signal-aperture]`, and `[data-event-token]` timeline targets.
- Produces: `[data-signal-chamber]` as the optical chamber and `[data-signal-flash]` as the semantic compression beat.

- [ ] **Step 1: Write the failing component contract**

Add to the existing `SignalAct` test:

```ts
expect(container.querySelector("[data-signal-chamber]")).toBeInTheDocument();
expect(container.querySelector("[data-signal-flash]")).toBeInTheDocument();
```

- [ ] **Step 2: Run the focused test and confirm failure**

Run: `pnpm vitest run src/components/acts/signal-act.test.tsx`

Expected: FAIL because the chamber and flash targets are absent.

- [ ] **Step 3: Add the semantic visual layers**

Insert before `.signal-act__aperture` in `SignalAct`:

```tsx
<div className="signal-act__chamber" data-signal-chamber aria-hidden="true">
  <i />
  <i />
  <b />
</div>
<i className="signal-act__flash" data-signal-flash aria-hidden="true" />
```

- [ ] **Step 4: Enlarge and illuminate the resolved state**

Update `signal.css` so the chamber spans the central 46–58% of the viewport, the aperture is at least 18rem wide on desktop and 9.5rem on mobile, event text meets the existing 11px mobile readability target, and incoming forms retain at least `opacity: 0.16` after convergence. Add a Reduced Motion rule that sets the flash to `display: none` and leaves the chamber/event state visible.

- [ ] **Step 5: Add the compression beat to the timeline**

In `createSignalTimeline`, animate the new targets without changing the causal order:

```ts
.fromTo(
  "[data-signal-chamber]",
  { opacity: 0.08, scaleX: 0.28 },
  { opacity: 1, scaleX: 1, duration: 0.34 },
  0.34,
)
.fromTo(
  "[data-signal-flash]",
  { opacity: 0, scaleX: 0.08 },
  { opacity: 0.82, scaleX: 1, duration: 0.055, yoyo: true, repeat: 1 },
  0.52,
)
```

- [ ] **Step 6: Run the focused test and commit**

Run: `pnpm vitest run src/components/acts/signal-act.test.tsx`

Expected: PASS.

Commit: `feat(v2): strengthen signal compression moment`

---

### Task 2: Edge hardware integration

**Files:**
- Create: `src/styles/v2/final-polish.test.ts`
- Modify: `src/components/acts/edge-intent-act.tsx`
- Modify: `src/styles/v2/edge-intent.css`
- Modify: `src/components/motion/edge-intent-timeline.ts`

**Interfaces:**
- Consumes: existing `.edge-intent-act__hardware`, `[data-edge-hardware-image]`, and six `[data-decision-stage]` nodes.
- Produces: a non-destructive masked hardware treatment and a higher-contrast active route.

- [ ] **Step 1: Write the failing style contract**

Create `final-polish.test.ts`:

```ts
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const read = (name: string) =>
  fs.readFileSync(path.join(process.cwd(), "src", "styles", "v2", name), "utf8");

describe("V2 final visual polish", () => {
  it("integrates the edge source image through a mask and optical blend", () => {
    const edge = read("edge-intent.css");
    expect(edge).toContain("mask-image");
    expect(edge).toContain("mix-blend-mode");
    expect(edge).toContain("data-edge-optical-frame");
  });
});
```

- [ ] **Step 2: Run the focused test and confirm failure**

Run: `pnpm vitest run src/styles/v2/final-polish.test.ts`

Expected: FAIL because the optical treatment is absent.

- [ ] **Step 3: Implement the hardware treatment**

Use `.edge-intent-act__hardware[data-edge-optical-frame]` with:

```css
background: #061014;
mask-image: linear-gradient(90deg, transparent, #000 10% 86%, transparent);
```

Apply `mix-blend-mode: luminosity` plus controlled cyan/warm pseudo-element overlays to the image. On mobile, use a shallow horizontal aspect ratio and crop around the DK-2500 board rather than showing the whole source slide.

- [ ] **Step 4: Add the marker and retune motion**

Add `data-edge-optical-frame` to the existing hardware `<figure>`. Retune the timeline’s scale and translation so the board crop remains visible while the six-stage route becomes dominant; do not change route order or outputs.

- [ ] **Step 5: Run focused tests and commit**

Run: `pnpm vitest run src/styles/v2/final-polish.test.ts src/components/acts/edge-intent-act.test.tsx`

Expected: PASS.

Commit: `feat(v2): integrate edge hardware into optical system`

---

### Task 3: Global stage polish and Reduced Motion safety

**Files:**
- Modify: `src/styles/v2/final-polish.test.ts`
- Modify: `src/styles/v2/base.css`
- Modify: `src/styles/v2/reduced-motion.css`

**Interfaces:**
- Consumes: `.v2-narrative`, `.v2-act`, and the existing Reduced Motion stylesheet.
- Produces: hidden native scrollbars, preserved scrollability, and visually sealed act boundaries.

- [ ] **Step 1: Extend the failing style contract**

Add assertions:

```ts
const base = read("base.css");
const reduced = read("reduced-motion.css");
expect(base).toContain("scrollbar-width: none");
expect(base).toContain("::-webkit-scrollbar");
expect(base).not.toContain("scroll-snap-type");
expect(reduced).toContain("[data-signal-flash]");
```

- [ ] **Step 2: Run the focused test and confirm failure**

Run: `pnpm vitest run src/styles/v2/final-polish.test.ts`

Expected: FAIL on the scrollbar and Reduced Motion contracts.

- [ ] **Step 3: Implement stage polish**

Add cross-browser scrollbar hiding to `html`/`body` without changing `overflow-y`, and add a non-interactive lower curtain to pinned act stages so the next section cannot read as an accidental strip. Disable the Signal flash in `reduced-motion.css` and keep chamber/event opacity at the final state.

- [ ] **Step 4: Run focused and complete tests, then commit**

Run: `pnpm vitest run src/styles/v2/final-polish.test.ts src/styles/v2/reduced-motion.test.ts`

Run: `pnpm test`

Expected: all tests PASS.

Commit: `fix(v2): seal cinematic stage transitions`

---

### Task 4: Live review, artifacts, and release gates

**Files:**
- Modify: `DESIGN_NOTES.md`
- Modify: `artifacts/verification/VERIFICATION.md`
- Regenerate: `artifacts/v2/desktop/*`
- Regenerate: `artifacts/v2/mobile/*`
- Regenerate: `artifacts/v2/qa/journey/*`
- Regenerate: `artifacts/v2/DELIVERY_MANIFEST.json`

**Interfaces:**
- Consumes: the finished production build and existing capture/QA scripts.
- Produces: current screenshots, journey evidence, and a hash-verified delivery manifest.

- [ ] **Step 1: Review the live desktop and mobile compositions**

Inspect Wake, Signal, Edge, Action, and Presence at 1280×720 and 390×844. Confirm Signal has a single strong focal point, the DK-2500 is integrated rather than card-like, the scrollbar is absent, and Wake/Action/Presence have not regressed.

- [ ] **Step 2: Run release gates**

Run:

```text
python -m unittest tests/test_extract_ppt_assets.py tests/test_prepare_v2_assets.py
node --test scripts/qa-runtime.test.mjs
pnpm test
pnpm lint
pnpm build
$env:GITHUB_PAGES='true'; pnpm build
```

Expected: every command exits 0; Next.js generates 7/7 static pages in both build modes.

- [ ] **Step 3: Regenerate browser evidence**

With the production server running on port 3002, run:

```powershell
$env:BASE_URL='http://127.0.0.1:3002'
$env:CHROME_PATH='C:\Program Files\Google\Chrome\Application\chrome.exe'
$env:QA_PASS='final-polish'
Remove-Item Env:QA_VIEWPORT -ErrorAction SilentlyContinue
Remove-Item Env:QA_REDUCED -ErrorAction SilentlyContinue
node scripts/capture-qa.mjs
$env:QA_VIEWPORT='mobile'
node scripts/capture-qa.mjs
Remove-Item Env:QA_VIEWPORT -ErrorAction SilentlyContinue
$env:QA_REDUCED='1'
node scripts/capture-qa.mjs
Remove-Item Env:QA_REDUCED -ErrorAction SilentlyContinue
node scripts/v2-journey-qa.mjs
```

Expected: exact bottom reach, reverse to 0, zero console warnings/errors, all Reduced Motion semantic outputs visible, and WebGL fallback visible.

- [ ] **Step 4: Recompose and validate delivery**

Run `python scripts/compose_v2_delivery.py --pass-name final-polish`, then independently recompute every manifest SHA-256. Expected: zero missing or mismatched entries.

- [ ] **Step 5: Update notes, commit, and push only the feature branch**

Document the compression chamber and optical hardware treatment. Commit with `feat(v2): complete final visual polish`, push `feature/visual-overhaul-v2`, and verify remote `0703` remains unchanged.
