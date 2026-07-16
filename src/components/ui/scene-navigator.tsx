"use client";

import { useEffect, useRef, useState } from "react";
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
  const panelRef = useRef<HTMLDivElement>(null);
  const activeIndex = V2_ACTS.findIndex((act) => act.id === active);

  useEffect(() => {
    const acts = V2_ACTS.flatMap((act) => {
      const element = document.getElementById(act.id);
      return element ? [{ id: act.id, element }] : [];
    });
    let frame = 0;

    const syncActiveScene = () => {
      frame = 0;
      const focusLine = window.innerHeight * 0.45;
      let next: ActId = acts[0]?.id ?? "wake";

      for (const act of acts) {
        const bounds = act.element.getBoundingClientRect();
        if (bounds.top <= focusLine) next = act.id;
        if (bounds.top <= focusLine && bounds.bottom > focusLine) break;
      }

      setActive((current) => (current === next ? current : next));
    };
    const scheduleSync = () => {
      if (!frame) frame = window.requestAnimationFrame(syncActiveScene);
    };

    syncActiveScene();
    window.addEventListener("scroll", scheduleSync, { passive: true });
    window.addEventListener("resize", scheduleSync);
    return () => {
      window.removeEventListener("scroll", scheduleSync);
      window.removeEventListener("resize", scheduleSync);
      if (frame) window.cancelAnimationFrame(frame);
    };
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
        ) &&
        !panelRef.current?.contains(event.target as Node)
      ) {
        event.preventDefault();
      }
    };
    const preventBackgroundScroll = (event: Event) => {
      if (!panelRef.current?.contains(event.target as Node)) {
        event.preventDefault();
      }
    };
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
      data-scene={active}
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
        ref={panelRef}
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
