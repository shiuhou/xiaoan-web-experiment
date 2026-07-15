"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ExperienceLoader } from "@/components/experience/experience-loader";
import { useExperience } from "@/components/experience/experience-context";
import { V2_ACTS } from "@/content/v2-content";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const WAKE_STATUS = [
  "SYSTEM / ONLINE",
  "EDGE / CONNECTED",
  "AGENT / AWAKE",
] as const;

export function WakeAct() {
  const root = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const { setActProgress } = useExperience();
  const wake = V2_ACTS[0];

  useLayoutEffect(() => {
    const section = root.current;
    if (!section || reducedMotion !== false) {
      setActProgress("wake", 1);
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
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

      gsap
        .timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
            invalidateOnRefresh: true,
            onRefresh: (trigger) =>
              setActProgress("wake", trigger.progress),
            onUpdate: (trigger) =>
              setActProgress("wake", trigger.progress),
          },
        })
        .to(
          "[data-wake-product]",
          { scale: 1.085, yPercent: 3, ease: "none" },
          0,
        )
        .to(
          ".wake-act__type--back",
          { yPercent: -17, opacity: 0.24, ease: "none" },
          0,
        )
        .to(
          ".wake-act__type--front",
          { yPercent: 24, opacity: 0.08, ease: "none" },
          0,
        )
        .to(
          ".wake-act__fracture",
          { xPercent: 34, opacity: 0.18, ease: "none" },
          0,
        )
        .to(
          "[data-wake-status], [data-wake-semantic]",
          { opacity: 0, yPercent: -22, ease: "none" },
          0.18,
        );
    }, section);

    return () => context.revert();
  }, [reducedMotion, setActProgress]);

  return (
    <section
      ref={root}
      id="wake"
      className="v2-act v2-act--wake wake-act"
      data-act="wake"
      aria-labelledby="wake-title"
    >
      <div className="wake-act__sticky">
        <div className="wake-act__field" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
        <div className="wake-act__fracture" aria-hidden="true" />

        <header className="wake-act__meta" data-wake-meta>
          <span>
            <b>01 /</b> AWAKENING
          </span>
          <span>SIGNAL TAKES FORM</span>
        </header>

        <div
          className="wake-act__type wake-act__type--back"
          data-wake-type-layer="back"
          aria-hidden="true"
        >
          <span>小安，</span>
          <span>不只存在於</span>
        </div>

        <div className="wake-act__product" data-wake-product>
          <ExperienceLoader />
        </div>

        <div
          className="wake-act__type wake-act__type--front"
          data-wake-type-layer="front"
          aria-hidden="true"
        >
          <span>屏幕裡。</span>
        </div>

        <div className="wake-act__semantic" data-wake-semantic>
          <h1 id="wake-title">{wake.zh}</h1>
          <p>一個會關注你，也能幫你做事的桌面具身 Agent。</p>
        </div>

        <ul className="wake-act__status" data-wake-status aria-label="概念系統狀態">
          {WAKE_STATUS.map((status) => (
            <li key={status}>{status}</li>
          ))}
        </ul>

        <p className="wake-act__descriptor" lang="en">
          {wake.en}
        </p>
        <div className="wake-act__scroll" aria-hidden="true">
          <span>SCROLL TO RELEASE SIGNAL</span>
          <i />
        </div>
      </div>
    </section>
  );
}
