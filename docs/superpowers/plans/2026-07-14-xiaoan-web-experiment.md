# Xiao-An Web Experiment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and visually verify an eight-scene, portfolio-grade Xiao-An scroll narrative with real product assets, one semantic WebGL scene, responsive fallbacks, and complete delivery artifacts.

**Architecture:** A one-route Next.js App Router site composes focused scene components from typed content. GSAP/ScrollTrigger and Lenis provide desktop narrative motion; React Three Fiber is dynamically loaded only for the Edge aperture. Mobile and reduced-motion modes render complete, readable final compositions without long pins or required WebGL.

**Tech Stack:** Next.js, TypeScript, React, GSAP, ScrollTrigger, Lenis, React Three Fiber, Drei, Vitest, Testing Library, Playwright, Python/Pillow extraction tooling.

## Global Constraints

- Work only in `C:\Users\USER\xiaoan-web-experiment`; keep `C:\Users\USER\xiao-an-robot` read-only.
- Preserve source files under `references/`; extracted originals stay under `work/` and curated copies under `public/assets/`.
- Do not initialise Git or publish the site without explicit user authority.
- Do not use remote images, external CDNs, network fonts, live APIs, or fabricated measurements.
- Use one main writing agent; the final reviewer is read-only.

---

### Task 1: Reproducible source asset extraction

**Files:**
- Create: `scripts/extract-ppt-assets.py`
- Create: `tests/test_extract_ppt_assets.py`
- Generate: `work/ppt-assets/final-deck/*`
- Generate: `public/assets/ppt/*`

**Interfaces:**
- Produces `run_extraction(pptx_path, output_dir, public_dir) -> dict[str, object]`.
- Produces JSON/CSV inventory, contact sheet, untouched originals, and selected copies.

- [x] Write tests for ZIP-only media extraction, slide context mapping, categories, contact sheet generation, selected copying, and Windows-safe console output.
- [x] Run the tests and confirm they fail because the script is absent.
- [x] Implement the minimal extraction pipeline.
- [x] Run all extraction tests and the script on `references/结题(3).pptx`.

### Task 2: Scaffold the app and lock the content contract

**Files:**
- Create: `package.json`, `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `vitest.config.ts`
- Create: `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`
- Create: `src/content/site-content.ts`
- Create: `src/content/site-content.test.ts`

**Interfaces:**
- Produces `SCENES`, a readonly eight-item content tuple with stable IDs `awakening`, `breaking`, `perception`, `edge`, `understanding`, `presence`, `system`, and `closing`.
- Produces `ASSETS`, a typed map for hero, hardware, architecture, and expression imagery.

- [ ] Write a failing Vitest assertion for scene count/order, maximum copy length, valid local asset paths, and concept-state labels without numeric metrics.
- [ ] Install the exact package set and run the test to observe the expected module-not-found failure.
- [ ] Implement the typed content and minimal semantic page shell.
- [ ] Re-run tests, lint, and a first production build.

### Task 3: Motion lifecycle and accessibility foundation

**Files:**
- Create: `src/hooks/use-reduced-motion.ts`
- Create: `src/hooks/use-page-visibility.ts`
- Create: `src/components/motion/motion-provider.tsx`
- Create: `src/components/motion/signal-thread.tsx`
- Create: `src/components/motion/motion-provider.test.tsx`

**Interfaces:**
- `MotionProvider` initialises Lenis only when reduced motion is false and owns ScrollTrigger refresh/cleanup.
- `SignalThread` exposes one decorative path with `aria-hidden="true"` and CSS progress variables.

- [ ] Write failing tests for reduced-motion Lenis suppression, cleanup, and accessible decorative markup.
- [ ] Implement the hooks and provider with `gsap.context()` cleanup and resize refresh.
- [ ] Verify tests and inspect Strict Mode for duplicate timelines.

### Task 4: Hero and Signature Moment

**Files:**
- Create: `src/components/scenes/awakening-scene.tsx`
- Create: `src/components/scenes/breaking-scene.tsx`
- Create: `src/components/ui/system-status.tsx`
- Create: `src/components/ui/cursor-field.tsx`
- Create: `src/styles/hero.css`, `src/styles/breaking.css`
- Create: `src/components/scenes/hero-scenes.test.tsx`

**Interfaces:**
- Both scenes consume only `SCENES`/`ASSETS` and register timelines inside local GSAP contexts.
- `BreakingScene` uses `[data-ui-plane]`, `[data-product-reveal]`, and `[data-signature-frame]` as stable motion/QA targets.

- [ ] Write failing render tests for real product asset usage, poster copy, status labels, signature targets, and replay-safe initial state.
- [ ] Implement the 2.5D Hero and the plane-to-depth transition.
- [ ] Start the development server and capture 1440×900 Hero and Signature frames.
- [ ] Rework composition before proceeding if the product is not the unique focal point.

### Task 5: Perception, Edge, and Understanding

**Files:**
- Create: `src/components/scenes/perception-scene.tsx`
- Create: `src/components/scenes/edge-scene.tsx`
- Create: `src/components/scenes/understanding-scene.tsx`
- Create: `src/components/canvas/edge-aperture.tsx`
- Create: `src/components/canvas/edge-aperture-fallback.tsx`
- Create: `src/components/canvas/edge-aperture.test.tsx`
- Create: `src/shaders/aperture.ts`

**Interfaces:**
- `EdgeAperture({ reducedMotion, compact })` caps DPR and particle count, pauses on hidden documents, and disposes geometry/materials.
- Fallback contains all four Edge labels and is never blank.

- [ ] Write failing tests for fallback completeness, bounded particle configuration, and concept-event copy.
- [ ] Implement perception signal convergence and Agent path convergence in DOM/SVG.
- [ ] Implement the WebGL aperture and dynamic-load boundary.
- [ ] Verify tests and browser console state with WebGL enabled and disabled.

### Task 6: Presence, System Reveal, and Closing

**Files:**
- Create: `src/components/scenes/presence-scene.tsx`
- Create: `src/components/scenes/system-reveal-scene.tsx`
- Create: `src/components/scenes/closing-scene.tsx`
- Create: `src/components/ui/scene-index.tsx`
- Create: `src/components/scenes/final-scenes.test.tsx`

**Interfaces:**
- Presence reuses the real product anchor and closes the Signal Thread loop.
- System Reveal renders Robot/Edge/Agent in horizontal desktop and vertical mobile order.
- Closing exposes a functional `EXPLORE AGAIN` control and only renders GitHub if configured.

- [ ] Write failing tests for action ordering, architecture labels, mobile order, and real controls.
- [ ] Implement the three scenes and their GSAP timelines.
- [ ] Verify all scene tests and keyboard interaction.

### Task 7: Responsive, reduced motion, and overflow hardening

**Files:**
- Create: `src/styles/tokens.css`, `src/styles/scenes.css`, `src/styles/responsive.css`
- Create: `tests/e2e/responsive.spec.ts`
- Create: `playwright.config.ts`

**Interfaces:**
- Desktop uses pinned timelines; under 768px scenes remain in normal flow.
- Reduced motion exposes final visual states and disables continuous loops.

- [ ] Write browser checks for 1440×900, 1920×1080, 1280×720, 1024×768, and 390×844 with `scrollWidth <= clientWidth`.
- [ ] Add responsive layouts, focus styles, touch-safe controls, and reduced-motion CSS.
- [ ] Run the checks and fix overflow/readability failures.

### Task 8: Three visual review rounds and capture deliverables

**Files:**
- Create: `artifacts/screenshots/desktop-full.png`
- Create: `artifacts/screenshots/mobile-full.png`
- Create: `artifacts/screenshots/hero-1440x900.png`
- Create: `artifacts/screenshots/signature-1440x900.png`
- Create: `artifacts/video/xiaoan-scroll-demo.webm`
- Create: `artifacts/reviews/visual-review.md`

- [ ] Composition review: inspect unique focal point, scene variety, template/card drift, and poster quality.
- [ ] Motion review: perform normal, fast, and slow full scrolls; test top replay, resize, and mid-page reload.
- [ ] Polish review: inspect desktop/mobile stills for alignment, legibility, glow, aliasing, and mobile independence.
- [ ] Capture fresh screenshots and a full scroll recording after fixes.

### Task 9: Read-only review, final fixes, verification, and documentation

**Files:**
- Create: `README.md`
- Update: `DESIGN_NOTES.md`
- Create: `ASSET_INVENTORY.md`
- Create: `artifacts/reviews/reviewer-report.md`
- Create: `artifacts/verification/lint.txt`, `build.txt`, `tests.txt`

- [ ] Dispatch one read-only Reviewer with the ten requested Creative Director/Motion/Performance questions.
- [ ] Verify the reviewer made no file changes and triage each recommendation.
- [ ] Apply only accepted fixes with regression tests where behaviour changes.
- [ ] Run fresh unit/e2e tests, lint, build, console inspection, overflow checks, and file inventory.
- [ ] Document installation, development, build, Vercel deployment, asset replacement, WebGL disabling, capture workflow, known limitations, and Concept UI boundaries.
- [ ] Report added/modified/moved/deleted counts, including zero categories.
