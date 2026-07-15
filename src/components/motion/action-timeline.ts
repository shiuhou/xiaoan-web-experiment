import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function createActionTimeline(
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
      scrub: 0.78,
      invalidateOnRefresh: true,
      onRefresh: (trigger) => onProgress(trigger.progress),
      onUpdate: (trigger) => onProgress(trigger.progress),
    },
  });

  return timeline
    .fromTo(
      "[data-action-route]",
      { strokeDashoffset: 1 },
      { strokeDashoffset: 0, duration: 0.48 },
      0.01,
    )
    .fromTo(
      "[data-action-pulse]",
      { left: compact ? "8%" : "7%", opacity: 0 },
      { left: compact ? "62%" : "65%", opacity: 1, duration: 0.46 },
      0.03,
    )
    .fromTo(
      "[data-action-product]",
      { opacity: 0.12, scale: compact ? 0.58 : 0.62, yPercent: 9 },
      { opacity: 1, scale: compact ? 0.86 : 0.82, yPercent: 1, duration: 0.48 },
      0.02,
    )
    .fromTo(
      "[data-action-output]",
      { opacity: 0, x: -14 },
      { opacity: 1, x: 0, stagger: 0.045, duration: 0.18 },
      0.14,
    )
    .to(
      "[data-action-pulse]",
      { scale: 1.8, opacity: 0.18, duration: 0.08 },
      0.46,
    )
    .fromTo(
      "[data-expression-mask]",
      { opacity: 0, clipPath: "inset(50% 50% 50% 50%)" },
      {
        opacity: 1,
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 0.18,
      },
      0.49,
    )
    .fromTo(
      "[data-physical-light]",
      { opacity: 0, clipPath: "circle(0% at 69% 54%)" },
      { opacity: 1, clipPath: "circle(92% at 69% 54%)", duration: 0.4 },
      0.48,
    )
    .to(
      "[data-cold-world]",
      { clipPath: "inset(0 100% 0 0)", duration: 0.41 },
      0.49,
    )
    .to(
      "[data-action-product]",
      {
        scale: compact ? 1.06 : 1.08,
        xPercent: compact ? 3 : 2,
        yPercent: compact ? 3 : 1,
        duration: 0.42,
      },
      0.49,
    )
    .to(
      "[data-product-dock-layer]",
      { xPercent: -1.6, yPercent: 0.8, duration: 0.24 },
      0.54,
    )
    .to(
      "[data-product-foreground-layer]",
      { xPercent: 1.8, yPercent: -0.9, duration: 0.24 },
      0.54,
    )
    .fromTo(
      "[data-voice-wave]",
      { strokeDashoffset: 1, opacity: 0 },
      { strokeDashoffset: 0, opacity: 0.72, stagger: 0.035, duration: 0.2 },
      0.6,
    )
    .fromTo(
      "[data-motion-track]",
      { strokeDashoffset: 1, opacity: 0 },
      { strokeDashoffset: 0, opacity: 0.66, duration: 0.22 },
      0.62,
    )
    .to(
      "[data-action-copy], [data-action-output], [data-action-decision]",
      { opacity: 0, yPercent: -12, stagger: 0.025, duration: 0.2 },
      0.7,
    )
    .to(
      "[data-action-pulse], [data-action-technical]",
      { opacity: 0, duration: 0.14 },
      0.7,
    )
    .to(
      "[data-product-dock-layer], [data-product-foreground-layer]",
      { xPercent: 0, yPercent: 0, duration: 0.18 },
      0.82,
    )
    .to(
      "[data-action-product]",
      { scale: compact ? 1.02 : 1.04, duration: 0.16 },
      0.84,
    );
}
