"use client";

import { useEffect, useState } from "react";
import { V2_ACTS, type ActId } from "@/content/v2-content";
import { SCENE_INDEX_EVENT } from "@/lib/ui-events";

const ACT_LABELS: Record<ActId, string> = {
  wake: "WAKE",
  break: "BREAK",
  signal: "SIGNAL",
  "edge-intent": "EDGE / INTENT",
  action: "ACTION",
  presence: "PRESENCE",
};

export function SceneNavigator() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<ActId>("wake");
  const activeIndex = V2_ACTS.findIndex((act) => act.id === active);

  useEffect(() => {
    if (typeof IntersectionObserver !== "function") {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) {
          setActive(visible.target.id as ActId);
        }
      },
      { rootMargin: "-38% 0px -48%", threshold: [0, 0.12, 0.4] },
    );
    for (const act of V2_ACTS) {
      const element = document.getElementById(act.id);
      if (element) observer.observe(element);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent(SCENE_INDEX_EVENT, { detail: { open } }),
    );
    if (!open) {
      delete document.documentElement.dataset.sceneIndexOpen;
      delete document.body.dataset.sceneIndexOpen;
      return;
    }
    const handleIndexKeyboard = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }
      if (
        ["PageDown", "PageUp", "ArrowDown", "ArrowUp", " ", "Home", "End"].includes(
          event.key,
        )
      ) {
        event.preventDefault();
      }
    };
    const preventBackgroundScroll = (event: Event) => event.preventDefault();
    window.addEventListener("keydown", handleIndexKeyboard);
    window.addEventListener("wheel", preventBackgroundScroll, { passive: false });
    window.addEventListener("touchmove", preventBackgroundScroll, {
      passive: false,
    });
    document.documentElement.dataset.sceneIndexOpen = "true";
    document.body.dataset.sceneIndexOpen = "true";
    return () => {
      window.removeEventListener("keydown", handleIndexKeyboard);
      window.removeEventListener("wheel", preventBackgroundScroll);
      window.removeEventListener("touchmove", preventBackgroundScroll);
      delete document.documentElement.dataset.sceneIndexOpen;
      delete document.body.dataset.sceneIndexOpen;
    };
  }, [open]);

  return (
    <nav
      className="scene-nav"
      data-open={open}
      data-v2-navigation=""
      aria-label="Scene index"
    >
      <div className="scene-nav__progress" aria-hidden="true">
        {V2_ACTS.map((act, index) => (
          <i
            key={act.id}
            data-current={index === activeIndex}
            data-passed={index < activeIndex}
          />
        ))}
      </div>

      <button
        className="scene-nav__toggle"
        type="button"
        aria-expanded={open}
        aria-controls="scene-index-panel"
        aria-label={open ? "Close scene index" : "Open scene index"}
        onClick={() => setOpen((value) => !value)}
      >
        <span>SCENE</span>
        <strong>{String(activeIndex + 1).padStart(2, "0")}</strong>
        <em>{ACT_LABELS[active]}</em>
        <i aria-hidden="true" />
      </button>

      <button
        className="scene-nav__backdrop"
        type="button"
        data-lenis-prevent
        aria-label="Close scene index backdrop"
        tabIndex={open ? 0 : -1}
        onClick={() => setOpen(false)}
      />

      <div
        className="scene-nav__panel"
        id="scene-index-panel"
        data-lenis-prevent
        hidden={!open}
      >
        <header className="scene-nav__meta">
          <span>SCENE INDEX / 2026</span>
          <strong>FROM SIGNAL<br />TO PRESENCE</strong>
        </header>
        <ol>
          {V2_ACTS.map((act) => (
            <li key={act.id} data-active={act.id === active}>
              <a
                href={`#${act.id}`}
                aria-label={`${act.index} ${act.id}`}
                onClick={() => setOpen(false)}
              >
                <span>{act.index}</span>
                <strong>{ACT_LABELS[act.id]}</strong>
                <em>{act.zh}</em>
                <i aria-hidden="true">↘</i>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
