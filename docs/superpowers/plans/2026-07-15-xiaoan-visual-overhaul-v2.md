# Xiao-An Visual Overhaul V2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild Xiao-An as a six-act cinematic scroll experience in which a cold two-dimensional signal acquires intent, a body, and finally a warm physical presence.

**Architecture:** Act-specific React components own semantic DOM and readable copy. A single dynamically loaded Experience Canvas owns product reveal, spatial signal compression, and Edge tunnel effects; a controller exposes clamped act progress and scroll velocity without querying DOM inside `useFrame`. Desktop and mobile use separate GSAP timelines, while Reduced Motion and WebGL-off modes render complete final compositions.

**Tech Stack:** Next.js 16 App Router/static export, TypeScript 5.9, React 19, GSAP 3.15/ScrollTrigger, Lenis 1.3, React Three Fiber 9.6, Three.js 0.180, CSS/SVG, Vitest/Testing Library, Playwright 1.61, Python/Pillow asset preprocessing.

## Global Constraints

- Work only in `C:\Users\USER\xiaoan-web-v2` on `feature/visual-overhaul-v2`; do not merge or push changes to `0703`.
- Keep `basePath` and `assetPrefix` equal to `/xiaoan-web-experiment` for GitHub Pages builds.
- Use real Xiao-An and DK-2500 assets; never generate or substitute another robot.
- Do not display fabricated accuracy, latency, throughput, user, sales, or deployment metrics.
- Chinese is the primary emotional narrative; English is limited to product labels and technical annotation.
- Presence is the final narrative climax; no long technical explanation may follow it.
- Desktop DPR is at most `1.5`; mobile DPR is at most `1`; mobile particle count is lower than desktop.
- Reduced Motion disables Lenis, scrub, long sticky scenes, WebGL animation, and velocity response while retaining complete content.
- Only the Hero product asset uses high-priority/eager loading; non-Hero assets remain lazy.
- Use TDD for content, state, fallback, preprocessing, and QA behavior; run a visual capture after every signature prototype.
- Do not use a global Signal Thread, repeated circular cores, continuous Bloom, or three repeated `left title + right core` compositions.

---

### Task 1: Replace the eight-scene content contract with six V2 acts

**Files:**
- Create: `src/content/v2-content.ts`
- Create: `src/content/v2-content.test.ts`
- Create: `src/components/acts/act-shell.tsx`
- Create: `src/components/acts/v2-narrative.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/components/ui/scene-navigator.tsx`

**Interfaces:**
- Produces: `ActId`, `ActContent`, `V2_ACTS`, `V2_ASSETS`, `AGENT_INPUTS`, `AGENT_OUTPUTS`.
- Produces: `<ActShell id: ActId, mode: "poster" | "cinematic" | "technical">`.
- Consumes: existing `withSiteBasePath()` from `src/content/site-content.ts` until it moves to a shared asset helper in Task 12.

- [ ] **Step 1: Write the failing six-act contract test**

```ts
import { describe, expect, it } from "vitest";
import { AGENT_INPUTS, AGENT_OUTPUTS, V2_ACTS } from "./v2-content";

describe("V2 narrative contract", () => {
  it("uses six acts with Chinese as the primary line", () => {
    expect(V2_ACTS.map((act) => act.id)).toEqual([
      "wake", "break", "signal", "edge-intent", "action", "presence",
    ]);
    for (const act of V2_ACTS) {
      expect(act.zh.length).toBeGreaterThan(4);
      expect(act.en.length).toBeLessThanOrEqual(48);
    }
  });

  it("does not reveal outputs on the input side", () => {
    expect(AGENT_INPUTS.every((input) => !("output" in input))).toBe(true);
    expect(AGENT_OUTPUTS).toEqual(["REMINDER", "CARE", "WAIT"]);
  });
});
```

- [ ] **Step 2: Run the test and confirm the module is missing**

Run: `pnpm vitest run src/content/v2-content.test.ts`  
Expected: FAIL because `./v2-content` does not exist.

- [ ] **Step 3: Implement the content contract**

```ts
export type ActId = "wake" | "break" | "signal" | "edge-intent" | "action" | "presence";
export type ActContent = {
  id: ActId;
  index: string;
  zh: string;
  en: string;
  mode: "poster" | "cinematic" | "technical";
};

export const V2_ACTS: readonly ActContent[] = [
  { id: "wake", index: "01", zh: "小安，不只存在於屏幕裡。", en: "XIAO-AN · EMBODIED DESKTOP AGENT", mode: "poster" },
  { id: "break", index: "02", zh: "把智能，帶出屏幕。", en: "BREAK THE INTERFACE · ENTER THE SPACE", mode: "cinematic" },
  { id: "signal", index: "03", zh: "訊號不是答案。理解，才是。", en: "SIGNAL TAKES FORM", mode: "technical" },
  { id: "edge-intent", index: "04", zh: "在邊緣，感知變成意圖。", en: "EDGE TO INTENT", mode: "technical" },
  { id: "action", index: "05", zh: "理解，最終成為動作。", en: "INTENT BECOMES ACTION", mode: "cinematic" },
  { id: "presence", index: "06", zh: "從虛擬中走出來，在現實中走近你。", en: "FROM VIRTUAL INTELLIGENCE TO PHYSICAL PRESENCE", mode: "poster" },
] as const;

export const AGENT_INPUTS = [
  { kind: "USER REQUEST", text: "30 秒後提醒我喝水。" },
  { kind: "COMPANION REQUEST", text: "小安，我有點累。" },
  { kind: "PASSIVE SIGNAL", text: "持續疲勞線索" },
] as const;
export const AGENT_OUTPUTS = ["REMINDER", "CARE", "WAIT"] as const;
```

- [ ] **Step 4: Add semantic act shells and switch the page to the V2 narrative scaffold**

`ActShell` must render `section#<id>`, `data-act`, a readable heading, and a mode class. `V2Narrative` initially renders six named semantic shells with complete headings so later tasks can replace one act at a time without reviving the generic Scene template.

- [ ] **Step 5: Run content and page tests**

Run: `pnpm vitest run src/content/v2-content.test.ts src/app/page.test.tsx`  
Expected: PASS with six `[data-act]` sections and no V1 scene IDs on the page.

- [ ] **Step 6: Commit**

```powershell
git add src/content/v2-content.ts src/content/v2-content.test.ts src/components/acts src/app/page.tsx src/components/ui/scene-navigator.tsx
git commit -m "feat(v2): establish six-act narrative"
```

### Task 2: Build and capture three genuinely different Hero concepts

**Files:**
- Create: `src/app/concepts/[direction]/page.tsx`
- Create: `src/components/concepts/concept-gallery.tsx`
- Create: `src/components/concepts/concept-a.tsx`
- Create: `src/components/concepts/concept-b.tsx`
- Create: `src/components/concepts/concept-c.tsx`
- Create: `src/styles/v2/concepts.css`
- Create: `scripts/capture-v2-concepts.mjs`
- Create: `src/components/concepts/concepts.test.tsx`
- Create: `ART_DIRECTION_V2.md`
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`

**Interfaces:**
- Consumes: `V2_ASSETS.hero` and Wake copy from Task 1.
- Produces: `/concepts/a`, `/concepts/b`, `/concepts/c`, screenshots under `artifacts/v2/concepts/`.

- [ ] **Step 1: Write a failing route/content test**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ConceptGallery } from "./concept-gallery";

describe("V2 concepts", () => {
  it("provides three named directions with the real product", () => {
    render(<ConceptGallery direction="a" />);
    expect(screen.getByRole("img", { name: /Xiao-An/i })).toBeVisible();
    expect(screen.getByText(/裂屏成形/)).toBeVisible();
  });
});
```

- [ ] **Step 2: Run the test and confirm it fails**

Run: `pnpm vitest run src/components/concepts/concepts.test.tsx`  
Expected: FAIL because `ConceptGallery` does not exist.

- [ ] **Step 3: Implement distinct static compositions**

Install a pinned, locally bundled Latin variable font before styling:

```powershell
pnpm add @fontsource-variable/inter-tight@5.2.7
```

Import its CSS from `src/app/globals.css`; no font file may be fetched at build or runtime.

- A: Chinese split across product foreground/background; black-to-porcelain slit; product 60% width.
- B: white editorial operating-system blocks, asymmetric red/cyan registration marks, product 42% width.
- C: warm close-up product theatre, soft shadow, product 70% width, minimal technical UI.
- Each concept must use a different DOM structure, not one component with color variants.

- [ ] **Step 4: Add a short autonomous reveal per concept**

- A: luma slit sweeps across product.
- B: UI blocks hard-cut into place.
- C: soft light aperture settles over product.
- Respect `prefers-reduced-motion` by showing final frames.

- [ ] **Step 5: Capture desktop and mobile concepts**

Run: `node scripts/capture-v2-concepts.mjs`  
Expected: six PNGs under `artifacts/v2/concepts/`, diagnostics with `consoleErrors: 0`, `pageErrors: 0`, and `overflow: false`.

- [ ] **Step 6: Select A and document the visual gate**

`ART_DIRECTION_V2.md` must include V1 baseline, A/B/C comparison, why A wins, rejected traits, palette, typography, light, depth, and links to all six captures. Do not claim Computer Use; record that Playwright/frames were used if app browser control remains unavailable.

- [ ] **Step 7: Commit**

```powershell
git add package.json pnpm-lock.yaml src/app/concepts src/components/concepts src/styles/v2/concepts.css scripts/capture-v2-concepts.mjs artifacts/v2/concepts ART_DIRECTION_V2.md
git commit -m "feat(v2): establish fracture-into-form art direction"
```

### Task 3: Preprocess real expression and product layers without altering sources

**Files:**
- Create: `scripts/prepare-v2-assets.py`
- Create: `tests/test_prepare_v2_assets.py`
- Create: `public/assets/v2/expression-care.png`
- Create: `public/assets/v2/product-foreground.png`
- Create: `public/assets/v2/product-dock.png`
- Create: `public/assets/v2/asset-manifest.json`
- Modify: `src/content/v2-content.ts`

**Interfaces:**
- Produces: deterministic `prepare_assets(source_root, output_root) -> dict[str, object]`.
- Produces: derived local asset paths in `V2_ASSETS`; never writes to `public/assets/product/`.

- [ ] **Step 1: Write failing source-preservation and crop tests**

```py
import hashlib
import json
import tempfile
import unittest
from pathlib import Path
from scripts.prepare_v2_assets import prepare_assets

class PrepareV2AssetsTest(unittest.TestCase):
    def test_generates_rgba_layers_without_modifying_sources(self):
        source = Path("public/assets/product")
        before = hashlib.sha256((source / "xiaoan-expressions.png").read_bytes()).hexdigest()
        with tempfile.TemporaryDirectory() as tmp:
            manifest = prepare_assets(source, Path(tmp))
            self.assertEqual(manifest["expression_care"]["mode"], "RGBA")
            self.assertTrue((Path(tmp) / "expression-care.png").exists())
        after = hashlib.sha256((source / "xiaoan-expressions.png").read_bytes()).hexdigest()
        self.assertEqual(before, after)
```

- [ ] **Step 2: Run and confirm import failure**

Run: `python -m unittest tests/test_prepare_v2_assets.py`  
Expected: FAIL because `scripts.prepare_v2_assets` does not exist.

- [ ] **Step 3: Implement deterministic Pillow preprocessing**

- Crop the top-right or bottom-left authentic cyan caring expression from the 3×2 source sheet using exact normalized bounds recorded in the manifest.
- Preserve alpha where present and save new PNGs.
- For product layers, use conservative masks/crops; if automatic separation produces visible damage, retain full image and make `product-foreground.png`／`product-dock.png` identical safe copies rather than inventing edges.
- Manifest includes source path, SHA-256, output dimensions, crop rectangle, mode, and transformation note.

- [ ] **Step 4: Run tests and generate assets**

Run: `python -m unittest tests/test_prepare_v2_assets.py && python scripts/prepare-v2-assets.py`  
Expected: tests PASS and four files appear under `public/assets/v2/`.

- [ ] **Step 5: Inspect all generated PNGs at original resolution**

Use the local image viewer. Reject rough cut-outs, face stretching, source text, or a crop that does not depict a real Xiao-An expression.

- [ ] **Step 6: Commit**

```powershell
git add scripts/prepare-v2-assets.py tests/test_prepare_v2_assets.py public/assets/v2 src/content/v2-content.ts
git commit -m "feat(v2): derive authentic product expression assets"
```

### Task 4: Add the unified experience state and motion controller

**Files:**
- Create: `src/lib/experience-state.ts`
- Create: `src/lib/experience-state.test.ts`
- Create: `src/components/experience/experience-controller.tsx`
- Create: `src/components/experience/experience-context.ts`
- Create: `src/components/motion/velocity-response.ts`
- Modify: `src/components/motion/motion-provider.tsx`

**Interfaces:**
- Produces: `clampProgress(value: number): number`.
- Produces: `createExperienceFrame(): ExperienceFrame` where each Act progress and `velocity` are mutable refs.
- Produces: `useExperience(): ExperienceControllerValue` with `frame`, `setActProgress`, and `setVelocity`.

- [ ] **Step 1: Write failing state tests**

```ts
import { describe, expect, it } from "vitest";
import { clampProgress, createExperienceFrame } from "./experience-state";

it("clamps progress and starts every act at zero", () => {
  expect(clampProgress(-1)).toBe(0);
  expect(clampProgress(1.4)).toBe(1);
  expect(createExperienceFrame()).toEqual({
    wake: 0, break: 0, signal: 0, edgeIntent: 0, action: 0, presence: 0, velocity: 0,
  });
});
```

- [ ] **Step 2: Run and confirm failure**

Run: `pnpm vitest run src/lib/experience-state.test.ts`  
Expected: FAIL because the state module does not exist.

- [ ] **Step 3: Implement the pure state helpers and context**

Use one stable `useRef<ExperienceFrame>` in the provider. Setter callbacks mutate the frame and mirror relevant values into root CSS custom properties; they do not trigger React render on every scroll event.

- [ ] **Step 4: Implement bounded velocity response**

`normaliseScrollVelocity(pxPerSecond)` clamps to `[-1, 1]`; CSS skew never exceeds `1.8deg`, ribbon stretch never exceeds `1.12`, and chromatic offset never exceeds `4px`. Reduced Motion returns zero.

- [ ] **Step 5: Run controller and MotionProvider tests**

Run: `pnpm vitest run src/lib/experience-state.test.ts src/components/motion/motion-provider.test.tsx`  
Expected: PASS; provider cleans listeners, Lenis, RAF, ScrollTrigger, and controller context.

- [ ] **Step 6: Commit**

```powershell
git add src/lib/experience-state* src/components/experience/experience-controller.tsx src/components/experience/experience-context.ts src/components/motion
git commit -m "feat(v2): add unified scroll experience controller"
```

### Task 5: Prototype and gate the cinematic Wake product reveal

**Files:**
- Create: `src/components/acts/wake-act.tsx`
- Create: `src/components/experience/experience-canvas.tsx`
- Create: `src/components/experience/experience-loader.tsx`
- Create: `src/components/experience/product-reveal.tsx`
- Create: `src/components/experience/experience-fallback.tsx`
- Create: `src/components/experience/product-reveal.test.tsx`
- Create: `src/shaders/product-reveal.ts`
- Create: `src/styles/v2/wake.css`
- Modify: `src/components/acts/v2-narrative.tsx`

**Interfaces:**
- Consumes: `useExperience().frame.wake`, `V2_ASSETS.hero`, `useReducedMotion`, `usePageVisibility`.
- Produces: `EXPERIENCE_BUDGET` with desktop DPR `1.5`, mobile DPR `1`, desktop reveal subdivisions ≤ `128×128`, mobile ≤ `72×72`.

- [ ] **Step 1: Write failing fallback and budget tests**

```tsx
it("keeps a complete Hero when WebGL is unavailable", () => {
  render(<ExperienceFallback mode="wake" />);
  expect(screen.getByRole("img", { name: /Xiao-An/i })).toBeVisible();
  expect(screen.getByText("小安，不只存在於屏幕裡。" )).toBeVisible();
});

it("keeps DPR bounded", () => {
  expect(EXPERIENCE_BUDGET.desktopDpr).toBeLessThanOrEqual(1.5);
  expect(EXPERIENCE_BUDGET.mobileDpr).toBeLessThanOrEqual(1);
});
```

- [ ] **Step 2: Run and confirm failure**

Run: `pnpm vitest run src/components/experience/product-reveal.test.tsx`  
Expected: FAIL because the experience components do not exist.

- [ ] **Step 3: Implement the Wake DOM composition and fallback**

Place the Chinese title behind and in front of the product using two clipped text layers. The Hero image occupies 55–62% desktop and stays fully recognisable on 390×844. Only this image uses `fetchPriority="high"`.

- [ ] **Step 4: Implement the texture reveal shader**

The fragment shader combines directional progress, deterministic fbm noise, and a narrow highlight edge. Pointer focus changes local refraction by at most `0.012` UV units. At `progress === 1`, color equals the source texture except for bounded lighting; no perpetual noise motion remains.

- [ ] **Step 5: Connect the reveal to a 1.6-second entrance and Wake scroll progress**

When loading at the top, run once. When loading mid-page, show the correct scroll-derived state immediately. On Reduced Motion, render the final composition without an entrance timeline.

- [ ] **Step 6: Capture and compare against V1 Hero**

Run the V2 capture script at 1440×900 and 390×844. Create `artifacts/v2/before/hero.png`, `artifacts/v2/after/hero.png`, and a side-by-side comparison. Reject the prototype if the product is not the unique focal point or if the result reads as V1 plus glow.

- [ ] **Step 7: Commit**

```powershell
git add src/components/acts/wake-act.tsx src/components/experience src/shaders src/styles/v2/wake.css artifacts/v2
git commit -m "feat(v2): create cinematic Xiao-An wake reveal"
```

### Task 6: Prototype the true screen-to-space fracture

**Files:**
- Create: `src/components/acts/break-act.tsx`
- Create: `src/components/motion/break-timeline.ts`
- Create: `src/components/acts/break-act.test.tsx`
- Create: `src/styles/v2/break.css`
- Modify: `src/components/motion/desktop-timeline.ts`
- Modify: `src/components/motion/mobile-timeline.ts`

**Interfaces:**
- Consumes: `setActProgress("break", value)` and `V2_ASSETS.hero`.
- Produces: `[data-screen-half="before|after"]`, `[data-break-product]`, and `createBreakTimeline(root, compact)`.

- [ ] **Step 1: Write a failing structural test**

```tsx
render(<BreakAct />);
expect(screen.getAllByTestId("screen-half")).toHaveLength(2);
expect(screen.getByText("把智能，帶出屏幕。" )).toBeVisible();
expect(screen.getByRole("img", { name: /Xiao-An/i })).toHaveAttribute("loading", "lazy");
```

- [ ] **Step 2: Run and confirm failure**

Run: `pnpm vitest run src/components/acts/break-act.test.tsx`  
Expected: FAIL because `BreakAct` does not exist.

- [ ] **Step 3: Implement one coherent 2D interface and two fracture halves**

Both halves render clipped views of one interface, not independent cards. The central seam cuts UI and Chinese text at the same coordinate. Keep semantic copy outside `aria-hidden` visual duplicates.

- [ ] **Step 4: Implement separate desktop and mobile timelines**

- Desktop: halves rotate Y ±18–24° and translate X/Z; product moves from `z:-220`／`scale:.68` to foreground.
- Mobile: halves move vertically and rotate X ±11°; product rises from center without horizontal overflow.
- Chromatic split peaks for less than 12% of timeline duration and returns to zero.

- [ ] **Step 5: Capture a 3–5 second prototype**

Save desktop and mobile clips under `artifacts/v2/signature-moments/break/`. Verify normal, fast, and reverse scrolling; final state must be deterministic.

- [ ] **Step 6: Commit**

```powershell
git add src/components/acts/break-act* src/components/motion/break-timeline.ts src/components/motion/desktop-timeline.ts src/components/motion/mobile-timeline.ts src/styles/v2/break.css artifacts/v2/signature-moments/break
git commit -m "feat(v2): fracture the interface into physical space"
```

### Task 7: Prototype semantic signal gathering and compression

**Files:**
- Create: `src/components/acts/signal-act.tsx`
- Create: `src/components/experience/signal-field.tsx`
- Create: `src/components/motion/signal-timeline.ts`
- Create: `src/components/acts/signal-act.test.tsx`
- Create: `src/styles/v2/signal.css`
- Modify: `src/components/experience/experience-canvas.tsx`

**Interfaces:**
- Consumes: `frame.signal` and the four concept event strings.
- Produces: five `[data-signal-kind]` elements and four `[data-event-token]` outputs.

- [ ] **Step 1: Write failing semantic tests**

```tsx
render(<SignalAct />);
expect(container.querySelectorAll("[data-signal-kind]")).toHaveLength(5);
expect(container.querySelectorAll("[data-event-token]")).toHaveLength(4);
expect(screen.queryByText(/accuracy|latency|ms|%/i)).not.toBeInTheDocument();
```

- [ ] **Step 2: Run and confirm failure**

Run: `pnpm vitest run src/components/acts/signal-act.test.tsx`  
Expected: FAIL because `SignalAct` does not exist.

- [ ] **Step 3: Implement five genuinely different signal forms**

- Camera: clipped scan slices.
- Voice: SVG ribbon waveform.
- Expression: bezier feature curves.
- Time: elongated tick rail.
- Context: fragmented text trail.

None may be a card or a label orbiting a circle.

- [ ] **Step 4: Implement GATHER → ALIGN → COMPRESS**

Use shader interpolation for spatial field points and DOM/SVG transforms for readable signal forms. Event tokens assemble from clipped fragments between progress `0.62` and `0.9`; they are not present as one sliding panel.

- [ ] **Step 5: Capture and gate the second Signature Moment**

Save desktop/mobile clips under `artifacts/v2/signature-moments/signal/`. Reject if the final event appears before the inputs visibly compress or if a viewer cannot distinguish all five inputs.

- [ ] **Step 6: Commit**

```powershell
git add src/components/acts/signal-act* src/components/experience/signal-field.tsx src/components/motion/signal-timeline.ts src/styles/v2/signal.css artifacts/v2/signature-moments/signal
git commit -m "feat(v2): compress perception signals into events"
```

### Task 8: Build the Edge tunnel and causal OpenClaw decision path

**Files:**
- Create: `src/components/acts/edge-intent-act.tsx`
- Create: `src/components/experience/edge-tunnel.tsx`
- Create: `src/components/experience/edge-tunnel.test.tsx`
- Create: `src/components/motion/edge-intent-timeline.ts`
- Create: `src/styles/v2/edge-intent.css`
- Remove: V1 Edge/Understanding/System imports from `src/app/page.tsx` and V2 narrative.

**Interfaces:**
- Consumes: `frame.edgeIntent`, `V2_ASSETS.dk2500`, `AGENT_INPUTS`, `AGENT_OUTPUTS`.
- Produces: `getTunnelPoint(index, progress): [number, number, number]`, `TUNNEL_BUDGET`, and ordered DOM nodes `INPUT → CONTEXT → MEMORY → SKILLS → DECISION → OUTPUT`.

- [ ] **Step 1: Write failing tunnel and causality tests**

```ts
it("moves raw points into bounded lanes", () => {
  const raw = getTunnelPoint(17, 0);
  const ordered = getTunnelPoint(17, 1);
  expect(Math.abs(ordered[1])).toBeLessThan(Math.abs(raw[1]));
  expect(Math.abs(ordered[2])).toBeLessThan(Math.abs(raw[2]));
});

it("keeps outputs after decision in DOM order", () => {
  render(<EdgeIntentAct />);
  const labels = [...container.querySelectorAll("[data-decision-stage]")].map((node) => node.textContent);
  expect(labels).toEqual(["INPUT", "CONTEXT", "MEMORY", "SKILLS", "DECISION", "OUTPUT"]);
});
```

- [ ] **Step 2: Run and confirm failure**

Run: `pnpm vitest run src/components/experience/edge-tunnel.test.tsx`  
Expected: FAIL because tunnel modules do not exist.

- [ ] **Step 3: Implement GPU-friendly tunnel geometry**

Precompute raw and ordered positions once; expose both as attributes and interpolate in the vertex shader via one uniform. Do not call DOM APIs or rewrite BufferAttributes in `useFrame`. Desktop particles ≤ 900; mobile ≤ 360.

- [ ] **Step 4: Add recognisable DK-2500 and causal decision DOM**

Render the real image without invert/grayscale filters. Inputs contain only source requests. Nodes illuminate in sequence; outputs remain clipped/hidden until DECISION is complete. ROBOT／EDGE／AGENT labels emerge briefly from the same route, then collapse.

- [ ] **Step 5: Verify fallback, performance budget, and reverse scroll**

Run unit tests with WebGL disabled and browser captures in both directions. The fallback must show DK-2500, all six stages, and three outputs without empty Canvas space.

- [ ] **Step 6: Commit**

```powershell
git add src/components/acts/edge-intent-act.tsx src/components/experience/edge-tunnel* src/components/motion/edge-intent-timeline.ts src/styles/v2/edge-intent.css src/app/page.tsx
git commit -m "feat(v2): turn edge perception into causal intent"
```

### Task 9: Build the Intent-to-Action climax and quiet Presence ending

**Files:**
- Create: `src/components/acts/action-act.tsx`
- Create: `src/components/acts/presence-act.tsx`
- Create: `src/components/motion/action-timeline.ts`
- Create: `src/components/acts/action-presence.test.tsx`
- Create: `src/styles/v2/action.css`
- Create: `src/styles/v2/presence.css`
- Modify: `src/components/experience/experience-canvas.tsx`

**Interfaces:**
- Consumes: `frame.action`, derived authentic expression, product/dock layers, and outputs `EXPRESSION`, `VOICE`, `MOTION`.
- Produces: `[data-action-product]`, `[data-expression-mask]`, `[data-physical-light]`, valid GitHub and Explore Again links.

- [ ] **Step 1: Write failing output and ending tests**

```tsx
render(<><ActionAct /><PresenceAct /></>);
expect(screen.getAllByRole("listitem").map((node) => node.textContent)).toEqual(
  expect.arrayContaining(["EXPRESSION", "VOICE", "MOTION"]),
);
expect(screen.queryByText("REMINDER")).not.toBeInTheDocument();
expect(screen.getByRole("link", { name: /GitHub/i })).toHaveAttribute(
  "href", expect.stringContaining("feature/visual-overhaul-v2"),
);
```

- [ ] **Step 2: Run and confirm failure**

Run: `pnpm vitest run src/components/acts/action-presence.test.tsx`  
Expected: FAIL because both act components are missing.

- [ ] **Step 3: Implement layered product approach and authentic face mask**

Product moves from distant cold composition to close warm composition; dock, robot, shadow, and expression use separate layers. The expression crop is masked to the screen and never stretched beyond its source aspect ratio. Voice uses outward wave geometry tied to output timing.

- [ ] **Step 4: Implement cold-to-warm takeover**

Between action progress `0.48` and `0.9`, interpolate CSS world colors and Canvas lighting. Technical annotations exit before the product reaches final scale. `SETTLE` finishes with zero velocity distortion and no particles.

- [ ] **Step 5: Implement the quiet final poster**

Use a different crop than Hero, one Chinese closing sentence, small English support, `Explore Again`, and the real feature-branch GitHub URL. No Dashboard, Demo, social icons, HUD, or technical architecture follows.

- [ ] **Step 6: Capture the third Signature Moment and V1/V2 Presence comparison**

Save desktop/mobile clips under `artifacts/v2/signature-moments/action/` and stills under `artifacts/v2/after/`. Reject if warm physical world does not visibly replace the digital world or if Presence is weaker than Break.

- [ ] **Step 7: Commit**

```powershell
git add src/components/acts/action-act.tsx src/components/acts/presence-act.tsx src/components/motion/action-timeline.ts src/styles/v2/action.css src/styles/v2/presence.css artifacts/v2
git commit -m "feat(v2): transform intent into physical presence"
```

### Task 10: Integrate desktop, mobile, navigation, and Reduced Motion systems

**Files:**
- Create: `src/components/motion/desktop-timeline.ts`
- Create: `src/components/motion/mobile-timeline.ts`
- Create: `src/components/motion/v2-narrative-motion.tsx`
- Create: `src/styles/v2/base.css`
- Create: `src/styles/v2/mobile.css`
- Create: `src/styles/v2/reduced-motion.css`
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`
- Modify: `src/components/ui/scene-navigator.tsx`
- Remove from runtime: `SignalThread`, V1 `NarrativeMotion`, V1 scene imports.

**Interfaces:**
- Consumes: all six Act selectors and controller setters.
- Produces: `createDesktopTimeline(root, controller)`, `createMobileTimeline(root, controller)`, and one cleanup boundary through `gsap.context()`／`gsap.matchMedia()`.

- [ ] **Step 1: Write failing runtime tests**

Tests assert six navigation items, no `.signal-thread`, no V1 Scene IDs, final compositions under Reduced Motion, and one cleanup call for all registered media/timelines.

- [ ] **Step 2: Run and confirm failure**

Run: `pnpm vitest run src/components/motion src/app/page.test.tsx`  
Expected: FAIL against the remaining V1 runtime.

- [ ] **Step 3: Implement desktop timeline orchestration**

Use one ScrollTrigger per Act plus short entrance timelines. Scene heights remain bounded: Break ≤ 180svh, Signal ≤ 180svh, Edge-to-Intent ≤ 230svh, Action ≤ 210svh; no 3000vh pins. Refresh after fonts/images and resize; mid-page reload derives state from scroll position.

- [ ] **Step 4: Implement independent mobile timelines**

- Break splits vertically.
- Signal flows top-to-bottom.
- Edge decision stages stack vertically.
- Action product approaches without exceeding viewport width.
- Disable pointer effects and reduce Canvas budgets.

- [ ] **Step 5: Implement Reduced Motion final compositions**

CSS forces natural/100svh heights, removes sticky positioning and transition-only hidden states, disables Canvas animation and Lenis, and exposes all semantic outputs.

- [ ] **Step 6: Remove template visual vocabulary from runtime**

Delete imports/usages of fixed Signal Thread, circular agent/orbit elements, V1 generic scene kicker template, and old Edge aperture. Old source files may remain temporarily only if unreferenced and scheduled for deletion in Task 12.

- [ ] **Step 7: Run all unit tests, lint, and build**

Run: `pnpm test && pnpm lint && pnpm build`  
Expected: all commands PASS with six static narrative acts.

- [ ] **Step 8: Commit**

```powershell
git add src/app src/components/motion src/components/ui src/styles/v2
git commit -m "feat(v2): integrate responsive cinematic narrative"
```

### Task 11: Harden QA scripts and deployment gate

**Files:**
- Modify: `scripts/capture-qa.mjs`
- Modify: `scripts/motion-qa.mjs`
- Modify: `scripts/responsive-qa.mjs`
- Modify: `scripts/record-scroll.mjs`
- Create: `scripts/v2-journey-qa.mjs`
- Create: `scripts/record-v2-signatures.mjs`
- Create: `scripts/record-v2-social.mjs`
- Create: `scripts/qa-runtime.test.mjs`
- Modify: `.github/workflows/deploy-pages.yml`

**Interfaces:**
- Produces: a browser resolver that uses Playwright Chromium first and `CHROME_PATH` only when explicitly set.
- Produces: nonzero exit on console error, page error, missing asset, failed response, or horizontal overflow.

- [ ] **Step 1: Write a failing QA resolver test**

The test imports `resolveBrowserExecutable()` and expects `undefined` when `CHROME_PATH` is absent, allowing Playwright bundled Chromium. It must not contain a hard-coded `C:\Program Files\Google\Chrome` path.

- [ ] **Step 2: Run and confirm failure**

Run: `node --test scripts/qa-runtime.test.mjs`  
Expected: FAIL until the shared QA resolver exists.

- [ ] **Step 3: Add robust journey scenarios**

Automate real wheel normal/slow/fast/reverse, rapid up/down, reload at Wake/Break/Edge/Action, resize, touch scroll, Reduced Motion, WebGL disabled, and overflow checks. Record console/page errors and failed network responses.

- [ ] **Step 4: Gate GitHub Pages deployment**

Workflow build job order must be:

```yaml
- run: pnpm install --frozen-lockfile
- run: pnpm test
- run: pnpm lint
- run: pnpm build
```

Do not deploy the feature branch; workflow remains triggered only by `0703` unless the user later approves replacement.

- [ ] **Step 5: Run QA tests, unit tests, lint, and static Pages build**

Run:

```powershell
node --test scripts/qa-runtime.test.mjs
pnpm test
pnpm lint
$env:GITHUB_PAGES='true'
$env:NEXT_PUBLIC_SITE_BASE_PATH='/xiaoan-web-experiment'
pnpm build
```

Expected: all PASS; `out/index.html` uses prefixed product and chunk paths.

- [ ] **Step 6: Commit**

```powershell
git add scripts .github/workflows/deploy-pages.yml
git commit -m "test(v2): harden visual journey and Pages gates"
```

### Task 12: Run three read-only reviews, polish, document, and deliver

**Files:**
- Create: `artifacts/v2/reviews/creative-review.md`
- Create: `artifacts/v2/reviews/motion-performance-review.md`
- Create: `artifacts/v2/reviews/engineering-review.md`
- Create: `MOTION_SYSTEM_V2.md`
- Create: `PERFORMANCE_REPORT_V2.md`
- Modify: `README.md`
- Modify: `DESIGN_NOTES.md`
- Modify: `ASSET_INVENTORY.md`
- Modify: `artifacts/verification/VERIFICATION.md`
- Delete only after confirming no imports: superseded V1 Scene, Signal Thread, old Edge aperture, and old V1-only CSS files.

**Interfaces:**
- Consumes: complete V2 site and all generated diagnostics.
- Produces: final screenshots, desktop/mobile/reduced recordings, three Signature clips, 15-second social cut, reports, and final commit SHA.

- [ ] **Step 1: Run Creative Direction read-only review**

Reviewer checks first-three-second impact, generic AI template residue, Chinese composition, three poster frames, unnecessary elements, cyan/circle/HUD dependence, and whether Action is the climax. Reviewer does not edit files.

- [ ] **Step 2: Apply only evidence-backed Creative changes**

Capture before/after for every accepted critique. Delete weak elements rather than compensating with more glow or particles.

- [ ] **Step 3: Run Motion/Performance read-only review**

Reviewer watches normal, slow, fast, reverse, wheel, and mobile recordings; checks causal motion, blank frames, drag, speed, signature strength, state recovery, Canvas value, and performance.

- [ ] **Step 4: Apply motion/performance changes and rerun captures**

Do not accept feedback that contradicts product identity, content accuracy, Reduced Motion, or the selected art direction. Record accepted/rejected decisions.

- [ ] **Step 5: Run Engineering read-only review**

Reviewer checks GSAP cleanup, ScrollTrigger lifecycle, Canvas disposal, shader uniforms, image priority, static export, base path, mobile, Reduced Motion, console, overflow, memory, and FPS evidence.

- [ ] **Step 6: Perform final browser QA and recording suite**

Generate:

- `artifacts/v2/desktop/` at 1440×900 plus 1920×1080/1280×720/1024×768 diagnostics.
- `artifacts/v2/mobile/` at 390×844.
- `artifacts/v2/reduced-motion/`.
- `artifacts/v2/signature-moments/` for Break, Signal, and Action.
- `artifacts/v2/recordings/xiaoan-v2-desktop.webm`.
- `artifacts/v2/recordings/xiaoan-v2-mobile.webm`.
- `artifacts/v2/recordings/xiaoan-v2-social-15s.webm`.
- V1/V2 Hero, Breaking, and Presence comparison boards.

- [ ] **Step 7: Remove dead V1 runtime files safely**

Run `rg` for every candidate import first. Delete only files with zero runtime/test imports and update CSS imports. Preserve all V1 artifacts under existing `artifacts/` as comparison evidence.

- [ ] **Step 8: Write final documentation and limitations**

`PERFORMANCE_REPORT_V2.md` includes device/browser assumptions, DPR/particle budgets, bundle observations, console/overflow results, app-browser limitation, and measured QA outputs. `MOTION_SYSTEM_V2.md` maps CUT/GATHER/COMPRESS/CHOOSE/RELEASE/SETTLE to exact Acts and selectors.

- [ ] **Step 9: Run final verification immediately before completion**

```powershell
python -m unittest tests/test_extract_ppt_assets.py tests/test_prepare_v2_assets.py
node --test scripts/qa-runtime.test.mjs
pnpm test
pnpm lint
$env:GITHUB_PAGES='true'
$env:NEXT_PUBLIC_SITE_BASE_PATH='/xiaoan-web-experiment'
pnpm build
git diff --check
git status --short
```

Expected: all tests/lint/build PASS; QA reports show console/page errors `0`, overflow `false`, all assets `200`; only intentional deliverables are uncommitted before the final commit.

- [ ] **Step 10: Commit and push only the feature branch**

```powershell
git add -A
git commit -m "feat(web): rebuild Xiao-An as cinematic scroll experience"
git push -u origin feature/visual-overhaul-v2
```

Confirm `0703` SHA and public GitHub Pages deployment are unchanged.
