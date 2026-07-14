# Xiao-An Creative Web Experiment Design

## Objective

Build an independent, one-route Next.js experience that turns Xiao-An’s real product form and three-layer architecture into an eight-scene scroll narrative: **FROM SIGNAL / TO UNDERSTANDING / TO PRESENCE**.

The result is a portfolio-grade concept site, not a presentation transcription, dashboard, robot controller, or claim of live performance.

## Source truth

- `references/结题(3).pptx` — 15-slide final deck and primary product imagery.
- `references/香港科技大学（广州）_小安_作品设计报告.docx` — product role, hardware, three-layer architecture, scene evidence, and limitations.
- `references/demo(1).txt` — embodied demo narrative and companion voice.
- `references/18ca..._8.doc` — blank functionality demonstration form; no product claims are derived from it.
- Live robot repository docs — only for current ownership boundaries: Robot gathers/acts, DK-2500 handles local processing and communication, OpenClaw understands/decides.

The missing second PPTX is recorded as a source limitation. No placeholder content is invented.

## Product boundary

The site contains simulated concept events but no simulated measured metrics. It does not connect to WebSocket, DK-2500 APIs, OpenClaw, login, controls, persistent data, or external services. All images and fonts are local.

## Architecture

Next.js App Router renders one semantic page. Scene copy lives in a typed content module. Each scene is a focused client component, while shared motion setup, accessibility state, WebGL loading, signal path, and cursor treatment are isolated reusable units. GSAP/ScrollTrigger controls desktop pinned timelines; Lenis supplies gentle smoothing only when motion is allowed. React Three Fiber is dynamically loaded for the Edge aperture and has a CSS fallback.

## Component boundaries

- `src/app/page.tsx` — scene composition only.
- `src/content/site-content.ts` — all user-visible copy, scene metadata, and asset paths.
- `src/components/scenes/*` — eight self-contained scenes.
- `src/components/motion/*` — Lenis, GSAP lifecycle, signal thread, and reveal primitives.
- `src/components/canvas/*` — WebGL aperture and fallback.
- `src/components/ui/*` — navigation, status rail, cursor, and replay control.
- `src/hooks/*` — reduced motion, pointer capability, and visibility state.
- `src/styles/*` — design tokens, layout, motion states, and responsive reductions.

## Narrative and visual system

The selected direction is Signal Chapel. A cyan Signal Thread links all scenes and changes behaviour according to semantic state: raw signal, organisation, decision, and action. The real product image remains the physical anchor. The Scene 02 plane-to-depth transformation is the Signature Moment. Scene 04 is the only substantial WebGL surface.

## Responsive strategy

Desktop at 1280px and above receives full pinning, 2.5D product layers, cursor response, and the full aperture. Tablet reduces depth, pin duration, and particle count. Mobile uses linear scenes, a static or lightweight aperture, vertical architecture, readable 32–60px type, no horizontal overflow, and only two key transitions. Reduced motion renders final states without scrub, pin, Lenis, or animation loops.

## Performance strategy

- Local images via Next Image where layout permits.
- Hero product preload; non-hero assets lazy by default.
- WebGL dynamic import with `ssr: false`.
- DPR capped at 1.5 desktop and 1 mobile.
- Render loop reduced when the document is hidden.
- Particle count bounded and device-aware.
- No remote fonts, images, analytics, or API calls.

## Verification

Automated checks cover content integrity, source asset availability, reduced-motion fallbacks, scene IDs/order, link validity, and overflow guard styles. Final verification runs unit tests, lint, production build, and browser console inspection. Visual QA captures 1440×900 and 390×844 after composition, motion, and polish passes. Scroll behaviour is tested at normal, fast, and slow speeds, after resize, after mid-page reload, and after returning to the top.

## Deliverables

The repository contains source code, extraction tooling and tests, curated local assets, `README.md`, `DESIGN_NOTES.md`, `ASSET_INVENTORY.md`, desktop/mobile full-page captures, Hero and Signature Moment captures, a full scroll recording, fresh lint/build output, known limitations, and asset replacement guidance.

## Explicit decisions

- The project is created as `C:\Users\USER\xiaoan-web-experiment`, outside the robot repository.
- The robot repository remains read-only.
- No Git repository or remote is created automatically.
- No site is published without a separate user request; README documents Vercel deployment instead.
