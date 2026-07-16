# Xiao-An V2 Final Polish Design

## Context

The current six-act V2 already has three strong anchors: Wake, Action, and Presence. A live desktop and 390×844 review found that the narrative loses visual intensity in the middle:

- Signal compresses into a very small, low-contrast centre and reads as a technical interstitial.
- The DK-2500 source image in Edge remains a bright rectangular slide instead of feeling embedded in the site’s optical system.
- The native browser scrollbar remains visible and weakens the poster-like framing.
- Near the end of some pinned acts, the following act becomes visible before the current composition has visually settled.

## Chosen direction

Use a focused middle-act reconstruction. Keep the current art direction, copy, six-act architecture, Hero WebGL, Action climax, Presence closing, and all accessibility fallbacks. Do not add another Canvas or external asset.

## Signal redesign

Signal becomes a larger “compression gate” rather than a tiny crosshair.

- Add a wide optical chamber behind the aperture using CSS pseudo-elements and restrained cyan-to-white light.
- Increase the aperture’s desktop and mobile footprint while keeping it linear rather than circular.
- Make the structured event output occupy more of the composition and raise its minimum contrast.
- Let incoming modality forms retain a visible residual trace after convergence so the transformation remains legible.
- Introduce a brief white compression flash driven by the existing GSAP timeline, followed by the resolved event state.
- Preserve the existing semantic sequence: raw signal → alignment → compression → structured state.

## Edge redesign

The DK-2500 image should read as source material entering an edge-compute layer.

- Replace the opaque white card treatment with a dark optical frame, gradient masks, cyan tint, and a controlled warm exit edge.
- Crop into the board rather than displaying the entire slide as a diagram thumbnail.
- Retain the original image unchanged in `public`; all treatment is non-destructive CSS.
- Keep the six-stage route as the readable system explanation, but increase the active stage contrast and reduce visual competition from the source image.
- On mobile, retain the vertical route and give the hardware crop a cinematic horizontal window.

## Global polish

- Hide the native scrollbar while preserving normal wheel, touch, keyboard, and programmatic scrolling.
- Add a dark stage curtain at act boundaries so adjacent scenes do not appear as accidental strips during pinned transitions.
- Do not use scroll snap or wheel interception.

## Motion and accessibility

- Reuse the existing ScrollTrigger timelines and cleanup model.
- Add only semantic motion: gate expansion, compression flash, image integration, and route emphasis.
- Reduced Motion must show the final readable state without flashes, pinning, or hidden content.
- WebGL remains Hero-only; Signal and Edge stay DOM/CSS/SVG.

## Responsive behavior

- Desktop: Signal gate spans the central field; event rows remain on the right but grow in scale and contrast.
- Mobile: event rows become the main centre composition; the gate sits behind them without clipping text.
- Edge hardware becomes a shallow cinematic strip on mobile, followed by the existing vertical decision route.
- No document-level horizontal overflow at 390×844.

## Acceptance criteria

- Signal is readable as a standalone desktop and mobile screenshot.
- DK-2500 no longer appears as a pasted white slide.
- No native scrollbar is visible, while scrolling remains fully functional.
- Wake, Action, and Presence compositions do not regress.
- Reduced Motion exposes all semantic content.
- Browser journey QA reports zero console warnings/errors, exact bottom reach, working reverse scroll, and a visible WebGL fallback.
- Unit tests, lint, normal build, and GitHub Pages build pass.

## Non-goals

- No new product claims, metrics, APIs, generated robot imagery, or remote assets.
- No new WebGL scene, video player, dashboard, or control interface.
- No merge into `0703` and no public deployment during this review pass.
