import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type SignalTarget = {
  selector: string;
  scale: number;
  rotation: number;
};

const SIGNAL_TARGETS: readonly SignalTarget[] = [
  { selector: '[data-signal-kind="camera"]', scale: 0.28, rotation: 90 },
  { selector: '[data-signal-kind="voice"]', scale: 0.24, rotation: 0 },
  { selector: '[data-signal-kind="expression"]', scale: 0.25, rotation: -8 },
  { selector: '[data-signal-kind="time"]', scale: 0.24, rotation: -90 },
  { selector: '[data-signal-kind="context"]', scale: 0.3, rotation: 0 },
];

export function createSignalTimeline(
  root: HTMLElement,
  compact: boolean,
  onProgress: (progress: number) => void,
) {
  gsap.registerPlugin(ScrollTrigger);
  const timeline = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: root,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.72,
      invalidateOnRefresh: true,
      onRefresh: (trigger) => onProgress(trigger.progress),
      onUpdate: (trigger) => onProgress(trigger.progress),
    },
  });

  timeline
    .to("[data-signal-copy]", { opacity: 0.2, yPercent: -20 }, 0.08)
    .fromTo(
      "[data-camera-slice]",
      { scaleY: 0.18 },
      { scaleY: 1, stagger: 0.025, duration: 0.19 },
      0.02,
    )
    .fromTo(
      "[data-voice-path], [data-expression-path]",
      { strokeDashoffset: 1 },
      { strokeDashoffset: 0, duration: 0.28 },
      0.02,
    )
    .fromTo(
      "[data-time-tick]",
      { scaleY: 0.1, opacity: 0.16 },
      { scaleY: 1, opacity: 1, stagger: 0.012, duration: 0.18 },
      0.04,
    )
    .fromTo(
      "[data-context-fragment]",
      { xPercent: (index) => (index % 2 === 0 ? -20 : 20), opacity: 0 },
      { xPercent: 0, opacity: 1, stagger: 0.025, duration: 0.2 },
      0.06,
    )
    .to("[data-signal-phase-line]", { scaleX: 1, duration: 0.94 }, 0.03);

  SIGNAL_TARGETS.forEach((target, index) => {
    timeline.to(
      target.selector,
      {
        left: compact ? "50%" : "48%",
        top: "51%",
        xPercent: -50,
        yPercent: -50,
        scale: target.scale,
        rotation: target.rotation,
        opacity: 0.08,
        duration: 0.48,
      },
      0.19 + index * 0.018,
    );
  });

  return timeline
    .fromTo(
      "[data-signal-aperture]",
      { scaleX: 2.2, opacity: 0.14 },
      { scaleX: 0.2, opacity: 1, duration: 0.36 },
      0.36,
    )
    .to(
      "[data-signal-aperture]",
      { scaleX: 1, opacity: 0.84, duration: 0.18 },
      0.72,
    )
    .fromTo(
      "[data-event-token]",
      { clipPath: "inset(0 100% 0 0)", x: compact ? 9 : 22, opacity: 0 },
      {
        clipPath: "inset(0 0% 0 0)",
        x: 0,
        opacity: 1,
        stagger: 0.045,
        duration: 0.22,
      },
      0.58,
    )
    .fromTo(
      "[data-event-concept]",
      { opacity: 0, y: 6 },
      { opacity: 1, y: 0, duration: 0.16 },
      0.56,
    )
    .fromTo(
      "[data-event-rail]",
      { scaleY: 0 },
      { scaleY: 1, duration: 0.26 },
      0.58,
    )
    .to("[data-compression-label]", { opacity: 1, y: 0, duration: 0.16 }, 0.77);
}
