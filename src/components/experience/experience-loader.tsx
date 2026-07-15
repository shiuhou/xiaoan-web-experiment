"use client";

import dynamic from "next/dynamic";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { ExperienceFallback } from "./experience-fallback";

const DynamicExperienceCanvas = dynamic(
  () =>
    import("./experience-canvas").then((module) => module.ExperienceCanvas),
  { ssr: false },
);

type WebGLProbeContext = {
  getExtension(name: string): { loseContext(): void } | null;
};

type WebGLProbeCanvas = {
  getContext(kind: string): WebGLProbeContext | null;
};

export function createWebGLSupportReader(
  createCanvas: () => WebGLProbeCanvas = () =>
    document.createElement("canvas") as unknown as WebGLProbeCanvas,
) {
  let cached: boolean | undefined;

  return () => {
    if (cached !== undefined) return cached;
    try {
      const canvas = createCanvas();
      const context =
        canvas.getContext("webgl2") ?? canvas.getContext("webgl");
      cached = Boolean(context);
      context
        ?.getExtension("WEBGL_lose_context")
        ?.loseContext();
      return cached;
    } catch {
      cached = false;
      return cached;
    }
  };
}

const canRenderWebGL = createWebGLSupportReader();

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
  mode?: "wake" | "signal" | "edge";
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
  const [canvasActive, setCanvasActive] = useState(false);
  const [canvasMounted, setCanvasMounted] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const markCanvasReady = useCallback(() => setCanvasReady(true), []);
  const canvasEnabled =
    !WEBGL_FORCED_OFF && reducedMotion === false && webglAvailable;

  useEffect(() => {
    const element = root.current;
    if (!element || !canvasEnabled) {
      return;
    }
    if (typeof IntersectionObserver !== "function") {
      const frame = window.requestAnimationFrame(() => {
        setCanvasMounted(true);
        setCanvasActive(true);
      });
      return () => window.cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const active = entry?.isIntersecting ?? false;
        setCanvasActive(active);
        if (active) setCanvasMounted(true);
      },
      { rootMargin: "110% 0px", threshold: 0 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [canvasEnabled]);

  return (
    <div
      ref={root}
      className="experience-loader"
      data-canvas-ready={canvasReady ? "true" : "false"}
      data-canvas-active={canvasActive ? "true" : "false"}
      data-webgl-enabled={canvasEnabled ? "true" : "false"}
    >
      <ExperienceFallback mode={mode} showCopy={false} />
      {canvasEnabled && canvasMounted ? (
        <DynamicExperienceCanvas
          active={canvasActive}
          compact={compact}
          mode={mode}
          onReady={markCanvasReady}
        />
      ) : null}
    </div>
  );
}
