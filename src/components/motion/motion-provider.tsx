"use client";

import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type PropsWithChildren, useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function MotionProvider({ children }: PropsWithChildren) {
  const root = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    document.documentElement.dataset.reducedMotion =
      reducedMotion === null ? "pending" : String(reducedMotion);
    if (reducedMotion !== false) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => undefined, root);
    const lenis = new Lenis({
      autoRaf: false,
      duration: 1.05,
      smoothWheel: true,
      syncTouch: false,
    });
    lenis.on("scroll", ScrollTrigger.update);

    let frame = 0;
    const tick = (time: number) => {
      lenis.raf(time);
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);

    let refreshTimer = 0;
    const refresh = () => {
      window.clearTimeout(refreshTimer);
      refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 120);
    };
    window.addEventListener("resize", refresh, { passive: true });
    ScrollTrigger.refresh();

    return () => {
      window.removeEventListener("resize", refresh);
      window.clearTimeout(refreshTimer);
      window.cancelAnimationFrame(frame);
      lenis.destroy();
      context.revert();
    };
  }, [reducedMotion]);

  return (
    <div
      ref={root}
      data-testid="motion-root"
      data-motion-root=""
      data-reduced-motion={
        reducedMotion === null ? "pending" : String(reducedMotion)
      }
    >
      {children}
    </div>
  );
}
