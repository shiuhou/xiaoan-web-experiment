import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function createWakeTimeline(
  root: HTMLElement,
  compact: boolean,
  onProgress: (progress: number) => void,
  playEntrance: boolean,
) {
  gsap.registerPlugin(ScrollTrigger);

  if (playEntrance) {
    gsap
      .timeline({ defaults: { ease: "power3.out" } })
      .fromTo(
        "[data-wake-meta]",
        { autoAlpha: 0, y: -12 },
        { autoAlpha: 1, y: 0, duration: 0.7 },
      )
      .fromTo(
        "[data-wake-type-layer] > span",
        { autoAlpha: 0, yPercent: 28 },
        { autoAlpha: 1, yPercent: 0, duration: 1.05, stagger: 0.08 },
        0.12,
      )
      .fromTo(
        "[data-wake-semantic], [data-wake-status]",
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.09 },
        0.42,
      );
  }

  return gsap
    .timeline({
      scrollTrigger: {
        trigger: root,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        invalidateOnRefresh: true,
        onRefresh: (trigger) => onProgress(trigger.progress),
        onUpdate: (trigger) => onProgress(trigger.progress),
      },
    })
    .to(
      "[data-wake-product]",
      {
        scale: compact ? 1.055 : 1.085,
        yPercent: compact ? 1.5 : 3,
        ease: "none",
      },
      0,
    )
    .to(
      ".wake-act__type--back",
      { yPercent: compact ? -11 : -17, opacity: 0.24, ease: "none" },
      0,
    )
    .to(
      ".wake-act__type--front",
      { yPercent: compact ? 16 : 24, opacity: 0.08, ease: "none" },
      0,
    )
    .to(
      ".wake-act__fracture",
      { xPercent: compact ? 20 : 34, opacity: 0.18, ease: "none" },
      0,
    )
    .to(
      "[data-wake-status], [data-wake-semantic]",
      { opacity: 0, yPercent: -22, ease: "none" },
      0.18,
    );
}
