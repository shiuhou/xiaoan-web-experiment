"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import type { SceneId } from "@/content/site-content";

type MotionVerb = "SIGNAL" | "PROCESS" | "DECISION" | "ACTION" | "QUIET";

export const NARRATIVE_TIMELINES: readonly {
  scene: SceneId;
  verb: MotionVerb;
  scrollLengthVh: number;
}[] = [
  { scene: "awakening", verb: "SIGNAL", scrollLengthVh: 100 },
  { scene: "breaking", verb: "PROCESS", scrollLengthVh: 190 },
  { scene: "perception", verb: "SIGNAL", scrollLengthVh: 155 },
  { scene: "edge", verb: "PROCESS", scrollLengthVh: 210 },
  { scene: "understanding", verb: "DECISION", scrollLengthVh: 155 },
  { scene: "presence", verb: "ACTION", scrollLengthVh: 190 },
  { scene: "system", verb: "PROCESS", scrollLengthVh: 210 },
  { scene: "closing", verb: "QUIET", scrollLengthVh: 100 },
] as const;

export const MOTION_LANGUAGE = {
  signatureMoment: {
    trigger: ".breaking-scene",
    planes: "[data-ui-plane]",
    reveal: "[data-product-reveal]",
  },
} as const;

function sceneTimeline(trigger: string, scrub = 0.8) {
  return gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger,
      start: "top top",
      end: "bottom bottom",
      scrub,
      invalidateOnRefresh: true,
    },
  });
}

export function NarrativeMotion() {
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    if (reducedMotion !== false || typeof window.matchMedia !== "function") {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    const root = document.querySelector("[data-motion-root]");
    if (!root) {
      return;
    }

    const context = gsap.context(() => {
      const heroStage = document.querySelector<HTMLElement>("[data-product-stage]");
      const heroScene = document.querySelector<HTMLElement>(".hero-scene");
      let onPointerMove: ((event: PointerEvent) => void) | undefined;
      let onPointerLeave: (() => void) | undefined;

      if (heroStage && heroScene && window.matchMedia("(pointer:fine)").matches) {
        const shiftX = gsap.quickTo(heroStage, "--shift-x", {
          duration: 0.8,
          ease: "power3.out",
        });
        const shiftY = gsap.quickTo(heroStage, "--shift-y", {
          duration: 0.8,
          ease: "power3.out",
        });
        onPointerMove = (event) => {
          const bounds = heroScene.getBoundingClientRect();
          shiftX(((event.clientX - bounds.left) / bounds.width - 0.5) * 12);
          shiftY(((event.clientY - bounds.top) / bounds.height - 0.5) * 9);
        };
        onPointerLeave = () => {
          shiftX(0);
          shiftY(0);
        };
        heroScene.addEventListener("pointermove", onPointerMove, { passive: true });
        heroScene.addEventListener("pointerleave", onPointerLeave);
      }

      if (window.scrollY < window.innerHeight * 0.45) {
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .from(".hero-scene__copy > *", {
            y: 42,
            opacity: 0,
            duration: 1.15,
            stagger: 0.11,
          })
          .from(
            ".product-layer--body",
            { xPercent: 14, scale: 0.92, duration: 1.5 },
            0.12,
          )
          .from(
            ".product-stage__orbit",
            { scale: 0.72, opacity: 0, duration: 1.25 },
            0.42,
          )
          .from(".system-status__item", { x: -18, opacity: 0, stagger: 0.08 }, 0.72);
      }

      gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: ".hero-scene",
          start: "top top",
          end: "bottom top",
          scrub: 0.65,
          invalidateOnRefresh: true,
        },
      })
        .to(".hero-scene__copy", { yPercent: -20, opacity: 0.16 }, 0)
        .to("[data-product-stage]", { scale: 1.13, xPercent: -4 }, 0)
        .to(".hero-scene__scan", { xPercent: -900, opacity: 0 }, 0)
        .to(".hero-scene__aura", { scale: 1.18, opacity: 0.36 }, 0);

      media.add("(min-width: 768px)", () => {
        const breaking = sceneTimeline(".breaking-scene", 0.82);
        breaking
          .to(
            "[data-ui-plane]",
            {
              x: (index) => `${index % 2 === 0 ? -38 - index * 5 : 38 + index * 5}vw`,
              y: (index) => `${(index - 1.5) * 9}vh`,
              z: (index) => 160 + index * 65,
              rotateY: (index) => (index % 2 === 0 ? -24 : 24),
              opacity: 0.06,
              stagger: 0.025,
            },
            0.14,
          )
          .to(
            "[data-product-reveal]",
            { opacity: 1, scale: 1.06, z: 90, yPercent: -8 },
            0.18,
          )
          .to(".breaking-scene__portal", { scale: 1.32, opacity: 0.72 }, 0.2)
          .to(".depth-axis i", { scaleX: 1.12 }, 0.2)
          .to(".breaking-scene__copy", { yPercent: -8 }, 0);

        sceneTimeline(".perception-scene", 0.76)
          .fromTo(
            "[data-signal-channel]",
            { opacity: 0.12, scale: 0.76 },
            { opacity: 1, scale: 1, stagger: 0.08 },
            0,
          )
          .to("[data-signal-channel]", { xPercent: -10, stagger: 0.06 }, 0.34)
          .fromTo(
            "[data-concept-event]",
            { yPercent: 50, opacity: 0 },
            { yPercent: 0, opacity: 1 },
            0.48,
          )
          .to(".perception-field__core", { rotate: 28, scale: 0.86 }, 0.15);

        sceneTimeline(".edge-scene", 0.88)
          .fromTo("[data-edge-track]", { y: 35, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.08 }, 0.08)
          .to(".edge-scene__canvas", { scale: 1.14 }, 0.15)
          .fromTo("[data-edge-hardware]", { xPercent: 20, opacity: 0 }, { xPercent: 0, opacity: 0.52 }, 0.36)
          .to(".edge-flow li i", { width: "100%", stagger: 0.06 }, 0.46)
          .to(".edge-flow__origin", { opacity: 0.28 }, 0.54)
          .to(".edge-flow__result", { scale: 1.08, color: "#a8f3ff" }, 0.62);

        sceneTimeline(".understanding-scene", 0.8)
          .fromTo("[data-agent-input]", { xPercent: -28, opacity: 0 }, { xPercent: 0, opacity: 1, stagger: 0.11 }, 0)
          .to("[data-agent-input]", { opacity: 0.34, stagger: 0.08 }, 0.52)
          .fromTo(".agent-core", { scale: 0.72 }, { scale: 1.08 }, 0.2)
          .to(".agent-orbit", { rotate: 48 }, 0)
          .to(".agent-core__rings i:first-child", { rotate: -72 }, 0);

        sceneTimeline(".presence-scene", 0.85)
          .fromTo("[data-presence-product]", { xPercent: 18, opacity: 0.42 }, { xPercent: -4, opacity: 1 }, 0.05)
          .fromTo("[data-embodied-output]", { x: -28, opacity: 0 }, { x: 0, opacity: 1, stagger: 0.08 }, 0.24)
          .fromTo(".presence-loop__line", { scaleX: 0, transformOrigin: "left" }, { scaleX: 1 }, 0.34)
          .to(".presence-product__screen", { scale: 1.45, opacity: 0.9 }, 0.48)
          .to(".presence-product__motion", { xPercent: 20, opacity: 0 }, 0.68);

        sceneTimeline(".system-scene", 0.9)
          .fromTo(
            "[data-system-layer]",
            { xPercent: 34, z: -260 },
            { xPercent: 0, z: 0, stagger: 0.12 },
            0.02,
          )
          .to("[data-system-layer]", { marginLeft: 0, marginRight: 0, stagger: 0.05 }, 0.5)
          .fromTo(".system-routes span", { y: 16 }, { y: 0, stagger: 0.06 }, 0.58);
      });

      media.add("(max-width: 767px)", () => {
        gsap.utils.toArray<HTMLElement>("[data-scene]").slice(1).forEach((scene) => {
          gsap.from(scene.querySelectorAll(".scene-kicker, .scene-title, .scene-zh"), {
            y: 26,
            opacity: 0,
            stagger: 0.08,
            duration: 0.72,
            ease: "power2.out",
            scrollTrigger: { trigger: scene, start: "top 78%", once: true },
          });
        });
        gsap.from("[data-system-layer]", {
          xPercent: 14,
          opacity: 0,
          stagger: 0.12,
          scrollTrigger: { trigger: ".system-layers", start: "top 78%", once: true },
        });
      });

      gsap.to(".signal-thread__active", {
        strokeDashoffset: -6,
        ease: "none",
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.45,
        },
      });

      gsap.fromTo(
        ".closing-scene__copy > *",
        { y: 34, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: { trigger: ".closing-scene", start: "top 64%", end: "top 10%", scrub: 0.5 },
        },
      );

      document.fonts?.ready.then(() => ScrollTrigger.refresh());

      return () => {
        if (heroScene && onPointerMove) {
          heroScene.removeEventListener("pointermove", onPointerMove);
        }
        if (heroScene && onPointerLeave) {
          heroScene.removeEventListener("pointerleave", onPointerLeave);
        }
      };
    }, root);

    return () => {
      media.revert();
      context.revert();
    };
  }, [reducedMotion]);

  return null;
}
