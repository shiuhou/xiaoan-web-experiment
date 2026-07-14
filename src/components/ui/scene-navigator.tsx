"use client";

import { useEffect, useState } from "react";
import { SCENES, type SceneId } from "@/content/site-content";

export function SceneNavigator() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<SceneId>("awakening");
  const activeIndex = SCENES.findIndex((scene) => scene.id === active);

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
          setActive(visible.target.id as SceneId);
        }
      },
      { rootMargin: "-38% 0px -48%", threshold: [0, 0.12, 0.4] },
    );
    for (const scene of SCENES) {
      const element = document.getElementById(scene.id);
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
          {String(activeIndex + 1).padStart(2, "0")} / {String(SCENES.length).padStart(2, "0")}
        </strong>
        <i aria-hidden="true" />
      </button>

      <div className="scene-nav__panel" id="scene-index-panel" hidden={!open}>
        <div className="scene-nav__meta">
          <span>FROM SIGNAL</span>
          <span>TO PRESENCE</span>
        </div>
        <ol>
          {SCENES.map((scene) => (
            <li key={scene.id} data-active={scene.id === active}>
              <a
                href={`#${scene.id}`}
                aria-label={`${scene.number} ${scene.id}`}
                onClick={() => setOpen(false)}
              >
                <span>{scene.number}</span>
                <strong>{scene.eyebrow.split(" / ")[0]}</strong>
                <i aria-hidden="true">↗</i>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
