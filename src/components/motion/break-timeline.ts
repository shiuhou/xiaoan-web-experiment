import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export type BreakMotionProfile = {
  axis: "x" | "y";
  rotationProperty: "rotationY" | "rotationX";
  rotationDegrees: number;
  splitDistancePercent: number;
};

export function getBreakMotionProfile(compact: boolean): BreakMotionProfile {
  return compact
    ? {
        axis: "y",
        rotationProperty: "rotationX",
        rotationDegrees: 11,
        splitDistancePercent: 76,
      }
    : {
        axis: "x",
        rotationProperty: "rotationY",
        rotationDegrees: 18,
        splitDistancePercent: 82,
      };
}

export function createBreakTimeline(
  root: HTMLElement,
  compact: boolean,
  onProgress: (progress: number) => void,
) {
  const profile = getBreakMotionProfile(compact);
  const beforeMotion = compact
    ? { yPercent: -profile.splitDistancePercent, rotationX: profile.rotationDegrees }
    : { xPercent: -profile.splitDistancePercent, rotationY: -profile.rotationDegrees };
  const afterMotion = compact
    ? { yPercent: profile.splitDistancePercent, rotationX: -profile.rotationDegrees }
    : { xPercent: profile.splitDistancePercent, rotationY: profile.rotationDegrees };

  gsap.registerPlugin(ScrollTrigger);
  return gsap
    .timeline({
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
    })
    .to("[data-break-copy]", { yPercent: -24, opacity: 0.18 }, 0)
    .to(
      '[data-screen-half="before"]',
      { ...beforeMotion, z: 150, opacity: 0.32 },
      0.08,
    )
    .to(
      '[data-screen-half="after"]',
      { ...afterMotion, z: 150, opacity: 0.32 },
      0.08,
    )
    .to(
      "[data-break-product]",
      { opacity: 1, scale: 1.04, z: 86, yPercent: compact ? 2 : -2 },
      0.12,
    )
    .to(
      "[data-break-chromatic]",
      { opacity: 0.92, scaleX: compact ? 1 : 1.28, duration: 0.055 },
      0.32,
    )
    .to(
      "[data-break-chromatic]",
      { opacity: 0, scaleX: 0.84, duration: 0.055 },
      0.375,
    )
    .to("[data-depth-route]", { scaleX: 1, opacity: 1 }, 0.42)
    .to("[data-break-product]", { scale: 1, yPercent: 0, z: 54 }, 0.76);
}
