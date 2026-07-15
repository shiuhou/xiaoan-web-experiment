"use client";

import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type PropsWithChildren, useEffect, useRef } from "react";
import { ExperienceController } from "@/components/experience/experience-controller";
import { useExperience } from "@/components/experience/experience-context";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import {
  SCENE_INDEX_EVENT,
  type SceneIndexEventDetail,
} from "@/lib/ui-events";

export function MotionProvider({ children }: PropsWithChildren) {
  const reducedMotion = useReducedMotion();

  return (
    <ExperienceController reducedMotion={reducedMotion !== false}>
      <MotionRuntime reducedMotion={reducedMotion}>{children}</MotionRuntime>
    </ExperienceController>
  );
}

type MotionRuntimeProps = PropsWithChildren<{
  reducedMotion: boolean | null;
}>;

function MotionRuntime({ children, reducedMotion }: MotionRuntimeProps) {
  const root = useRef<HTMLDivElement>(null);
  const { setVelocity } = useExperience();

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
    const stopListening = lenis.on("scroll", (instance) => {
      ScrollTrigger.update();
      setVelocity(instance.velocity * 60);
    });
    const handleSceneIndex = (event: Event) => {
      const { open } = (event as CustomEvent<SceneIndexEventDetail>).detail;
      if (open) {
        lenis.stop();
        setVelocity(0);
      } else {
        lenis.start();
      }
    };
    window.addEventListener(SCENE_INDEX_EVENT, handleSceneIndex);

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
      window.removeEventListener(SCENE_INDEX_EVENT, handleSceneIndex);
      window.clearTimeout(refreshTimer);
      window.cancelAnimationFrame(frame);
      stopListening?.();
      lenis.destroy();
      context.revert();
    };
  }, [reducedMotion, setVelocity]);

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
