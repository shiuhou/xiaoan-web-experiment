"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { useExperience } from "@/components/experience/experience-context";
import {
  createBreakTimeline,
  getBreakMotionProfile,
} from "@/components/motion/break-timeline";
import { V2_ACTS, V2_ASSETS } from "@/content/v2-content";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const INTERFACE_ITEMS = ["CHAT", "TASKS", "CALENDAR", "REMINDER"] as const;

function InterfaceCanvas() {
  return (
    <div className="break-interface" data-interface-canvas>
      <header className="break-interface__bar">
        <span>XIAO-AN.OS / AGENT WINDOW</span>
        <span>SCREEN-BOUND</span>
      </header>
      <nav className="break-interface__rail" aria-hidden="true">
        {INTERFACE_ITEMS.map((item, index) => (
          <span key={item}>
            {String(index + 1).padStart(2, "0")} / {item}
          </span>
        ))}
      </nav>
      <div className="break-interface__session">
        <span className="break-interface__prompt">USER / DESKTOP SESSION</span>
        <strong>Agent 不應該永遠被困在屏幕裡。</strong>
        <div className="break-interface__messages">
          <i />
          <i />
          <i />
        </div>
      </div>
      <aside className="break-interface__agenda">
        <span>NOW</span>
        <b>15:40</b>
        <i />
        <small>ONE MORE WINDOW</small>
      </aside>
      <footer className="break-interface__ticker">
        <span>CHAT → TASK → REMINDER → REPLY</span>
        <span>NO BODY / NO DISTANCE / NO PRESENCE</span>
      </footer>
    </div>
  );
}

export function BreakAct() {
  const root = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const { setActProgress } = useExperience();
  const act = V2_ACTS[1];

  useLayoutEffect(() => {
    const section = root.current;
    if (!section || reducedMotion !== false) {
      setActProgress("break", 1);
      return;
    }

    const compact = window.matchMedia("(max-width: 767px)").matches;
    const context = gsap.context(() => {
      createBreakTimeline(section, compact, (progress) =>
        setActProgress("break", progress),
      );
    }, section);

    return () => context.revert();
  }, [reducedMotion, setActProgress]);

  return (
    <section
      ref={root}
      id="break"
      className="v2-act v2-act--break break-act"
      data-act="break"
      aria-labelledby="break-title"
    >
      <div className="break-act__stage">
        <div className="break-act__copy" data-break-copy>
          <span>02 / BREAKING THE SCREEN</span>
          <h2 id="break-title">{act.zh}</h2>
          <p>Agent 不應該永遠被困在屏幕裡。</p>
        </div>

        <div className="break-act__product" data-break-product>
          <div className="break-act__product-light" aria-hidden="true" />
          <Image
            src={V2_ASSETS.productDock}
            alt="Xiao-An entering physical space"
            fill
            loading="lazy"
            sizes="(max-width: 767px) 88vw, 52vw"
          />
        </div>

        <div
          className="break-act__screen"
          aria-hidden="true"
          data-motion-axis={getBreakMotionProfile(false).axis}
        >
          <div
            className="break-act__half break-act__half--before"
            data-screen-half="before"
            data-testid="screen-half"
          >
            <InterfaceCanvas />
          </div>
          <div
            className="break-act__half break-act__half--after"
            data-screen-half="after"
            data-testid="screen-half"
          >
            <InterfaceCanvas />
          </div>
          <div className="break-act__seam" aria-hidden="true" />
        </div>

        <div
          className="break-act__chromatic"
          data-break-chromatic
          aria-hidden="true"
        />

        <div className="break-act__depth" aria-hidden="true">
          <span>INTERFACE / FLAT</span>
          <i data-depth-route />
          <span>PRESENCE / DEPTH</span>
        </div>
      </div>
    </section>
  );
}
