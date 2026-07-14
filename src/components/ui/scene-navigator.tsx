"use client";

import { useEffect, useState } from "react";
import { V2_ACTS, type ActId } from "@/content/v2-content";

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
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  return (
    <nav className="scene-nav" data-open={open} aria-label="Scene index">
      <button
        className="scene-nav__toggle"
        type="button"
        aria-expanded={open}
        aria-controls="scene-index-panel"
        aria-label={open ? "Close scene index" : "Open scene index"}
        onClick={() => setOpen((value) => !value)}
      >
        <span>INDEX</span>
        <strong>
          {String(activeIndex + 1).padStart(2, "0")} / {String(V2_ACTS.length).padStart(2, "0")}
        </strong>
        <i aria-hidden="true" />
      </button>

      <div className="scene-nav__panel" id="scene-index-panel" hidden={!open}>
        <div className="scene-nav__meta">
          <span>SIGNAL TAKES</span>
          <span>FORM</span>
        </div>
        <ol>
          {V2_ACTS.map((act) => (
            <li key={act.id} data-active={act.id === active}>
              <a
                href={`#${act.id}`}
                aria-label={`${act.index} ${act.id}`}
                onClick={() => setOpen(false)}
              >
                <span>{act.index}</span>
                <strong>{act.en.split(" · ")[0]}</strong>
                <i aria-hidden="true">↗</i>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
