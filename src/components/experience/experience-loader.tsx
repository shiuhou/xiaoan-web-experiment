"use client";

import dynamic from "next/dynamic";
import { useCallback, useState, useSyncExternalStore } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { ExperienceFallback } from "./experience-fallback";

const DynamicExperienceCanvas = dynamic(
  () =>
    import("./experience-canvas").then((module) => module.ExperienceCanvas),
  { ssr: false },
);

function canRenderWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      (window.WebGL2RenderingContext && canvas.getContext("webgl2")) ||
        (window.WebGLRenderingContext && canvas.getContext("webgl")),
    );
  } catch {
    return false;
  }
}

function subscribeCompact(callback: () => void) {
  if (typeof window.matchMedia !== "function") {
    return () => undefined;
  }
  const media = window.matchMedia("(max-width: 767px)");
  media.addEventListener?.("change", callback);
  return () => media.removeEventListener?.("change", callback);
}

function getCompactSnapshot() {
  return typeof window.matchMedia === "function"
    ? window.matchMedia("(max-width: 767px)").matches
    : false;
}

const subscribeWebGL = () => () => undefined;
const WEBGL_FORCED_OFF = process.env.NEXT_PUBLIC_DISABLE_WEBGL === "1";

export function ExperienceLoader({
  mode = "wake",
}: {
  mode?: "wake" | "signal";
}) {
  const reducedMotion = useReducedMotion();
  const compact = useSyncExternalStore(
    subscribeCompact,
    getCompactSnapshot,
    () => false,
  );
  const webglAvailable = useSyncExternalStore(
    subscribeWebGL,
    canRenderWebGL,
    () => false,
  );
  const [canvasReady, setCanvasReady] = useState(false);
  const markCanvasReady = useCallback(() => setCanvasReady(true), []);
  const canvasEnabled =
    !WEBGL_FORCED_OFF && reducedMotion === false && webglAvailable;

  return (
    <div
      className="experience-loader"
      data-canvas-ready={canvasReady ? "true" : "false"}
      data-webgl-enabled={canvasEnabled ? "true" : "false"}
    >
      <ExperienceFallback mode={mode} showCopy={false} />
      {canvasEnabled ? (
        <DynamicExperienceCanvas
          compact={compact}
          mode={mode}
          onReady={markCanvasReady}
        />
      ) : null}
    </div>
  );
}
