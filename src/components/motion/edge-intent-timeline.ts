import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function createEdgeIntentTimeline(
  root: HTMLElement,
  compact: boolean,
  onProgress: (progress: number) => void,
) {
  gsap.registerPlugin(ScrollTrigger);
  const routeScale = compact ? { scaleY: 1 } : { scaleX: 1 };
  const timeline = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: root,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.76,
      invalidateOnRefresh: true,
      onRefresh: (trigger) => onProgress(trigger.progress),
      onUpdate: (trigger) => onProgress(trigger.progress),
    },
  });

  timeline
    .to("[data-edge-copy]", { opacity: 0.18, yPercent: -18 }, 0.08)
    .fromTo(
      "[data-edge-hardware]",
      { opacity: 0, clipPath: "inset(0 100% 0 0)" },
      {
        opacity: 1,
        clipPath: "inset(0 0% 0 0)",
        duration: 0.22,
      },
      0.01,
    )
    .to(
      "[data-edge-hardware]",
      {
        xPercent: compact ? 0 : -25,
        yPercent: compact ? -14 : 25,
        scale: compact ? 0.72 : 0.64,
        opacity: 0.72,
        duration: 0.44,
      },
      0.22,
    )
    .to(
      "[data-edge-hardware-image]",
      {
        xPercent: compact ? -17 : -25,
        yPercent: compact ? 9 : 17,
        scale: compact ? 1.55 : 1.82,
        duration: 0.43,
      },
      0.22,
    )
    .fromTo(
      "[data-edge-request]",
      { opacity: 0, xPercent: compact ? 0 : 18, y: compact ? 12 : 0 },
      { opacity: 1, xPercent: 0, y: 0, stagger: 0.035, duration: 0.16 },
      0.08,
    )
    .to(
      "[data-edge-request]",
      {
        xPercent: compact ? 0 : -34,
        yPercent: compact ? 50 : 0,
        opacity: 0,
        stagger: 0.025,
        duration: 0.14,
      },
      0.24,
    )
    .fromTo(
      "[data-edge-layer]",
      { opacity: 0, letterSpacing: "0.32em", y: 12 },
      { opacity: 0.82, letterSpacing: "0.08em", y: 0, stagger: 0.045, duration: 0.2 },
      0.18,
    )
    .to(
      "[data-edge-layer]",
      { opacity: 0, scaleX: 0.3, stagger: 0.03, duration: 0.16 },
      0.44,
    )
    .fromTo(
      "[data-edge-plane]",
      { opacity: 0.04, scaleY: 0.24 },
      { opacity: 0.46, scaleY: 1, stagger: 0.035, duration: 0.25 },
      0.2,
    )
    .to("[data-edge-route]", { opacity: 1, duration: 0.12 }, 0.27)
    .to("[data-edge-route-line]", { ...routeScale, duration: 0.64 }, 0.29)
    .to(
      "[data-decision-stage]",
      { opacity: 1, color: "#eaf3ee", stagger: 0.07, duration: 0.18 },
      0.31,
    )
    .to(
      "[data-decision-stage] [data-stage-mark]",
      { scale: 1, opacity: 1, stagger: 0.07, duration: 0.16 },
      0.31,
    )
    .fromTo(
      "[data-agent-output]",
      {
        opacity: 0,
        clipPath: compact ? "inset(0 0 100% 0)" : "inset(0 100% 0 0)",
      },
      {
        opacity: 1,
        clipPath: "inset(0 0% 0 0)",
        stagger: 0.045,
        duration: 0.19,
      },
      0.78,
    )
    .to("[data-decision-pulse]", { opacity: 1, scale: 1, duration: 0.14 }, 0.73)
    .to("[data-decision-pulse]", { opacity: 0.24, scale: 0.5, duration: 0.13 }, 0.87);

  return timeline;
}
