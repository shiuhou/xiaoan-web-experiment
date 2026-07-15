"use client";

import { type PropsWithChildren, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useExperience } from "@/components/experience/experience-context";
import { V2_ACTS } from "@/content/v2-content";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { createDesktopTimeline } from "./desktop-timeline";
import { createMobileTimeline } from "./mobile-timeline";

export function V2NarrativeMotion({ children }: PropsWithChildren) {
  const root = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const { setActProgress } = useExperience();

  useLayoutEffect(() => {
    const narrative = root.current;
    if (!narrative) return;

    if (reducedMotion !== false) {
      narrative.dataset.v2MotionState = "final";
      for (const act of V2_ACTS) setActProgress(act.id, 1);
      return () => delete narrative.dataset.v2MotionState;
    }

    narrative.dataset.v2MotionState = "animated";
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    const controller = { setActProgress };

    media.add("(min-width: 768px)", () => {
      const context = gsap.context(() => {
        createDesktopTimeline(narrative, controller);
      }, narrative);
      return () => context.revert();
    });

    media.add("(max-width: 767px)", () => {
      const context = gsap.context(() => {
        createMobileTimeline(narrative, controller);
      }, narrative);
      return () => context.revert();
    });

    let cancelled = false;
    const refresh = () => {
      if (!cancelled) ScrollTrigger.refresh();
    };
    const images = [...narrative.querySelectorAll("img")].filter(
      (image) => !image.complete,
    );
    for (const image of images) image.addEventListener("load", refresh);
    void document.fonts?.ready.then(refresh);

    return () => {
      cancelled = true;
      for (const image of images) image.removeEventListener("load", refresh);
      media.revert();
      delete narrative.dataset.v2MotionState;
      delete narrative.dataset.v2Layout;
    };
  }, [reducedMotion, setActProgress]);

  return (
    <div
      ref={root}
      className="v2-narrative"
      data-testid="v2-narrative-motion"
      data-v2-motion-state={reducedMotion === false ? "animated" : "final"}
    >
      {children}
    </div>
  );
}
