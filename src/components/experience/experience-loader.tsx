"use client";

import dynamic from "next/dynamic";
import {
  Component,
  type ReactNode,
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
      const context = createCanvas().getContext("webgl2");
      cached = Boolean(context);
      context?.getExtension("WEBGL_lose_context")?.loseContext();
      return cached;
    } catch {
      cached = false;
      return cached;
    }
  };
}

const canRenderWebGL = createWebGLSupportReader();

function subscribeCompact(callback: () => void) {
  if (typeof window.matchMedia !== "function") return () => undefined;
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

class CanvasErrorBoundary extends Component<
  { children: ReactNode; onUnavailable: () => void },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onUnavailable();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export function ExperienceLoader() {
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
  const unmountTimer = useRef<number | null>(null);
  const markCanvasReady = useCallback(() => setCanvasReady(true), []);
  const markCanvasUnavailable = useCallback(() => setCanvasReady(false), []);
  const canvasEnabled =
    !WEBGL_FORCED_OFF && reducedMotion === false && webglAvailable;

  useEffect(() => {
    if (canvasEnabled) return;
    const frame = window.requestAnimationFrame(() => {
      setCanvasActive(false);
      setCanvasMounted(false);
      setCanvasReady(false);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [canvasEnabled]);

  useEffect(() => {
    const element = root.current;
    if (!element || !canvasEnabled) return;
    const clearUnmountTimer = () => {
      if (unmountTimer.current !== null) {
        window.clearTimeout(unmountTimer.current);
        unmountTimer.current = null;
      }
    };
    const activate = () => {
      clearUnmountTimer();
      setCanvasMounted(true);
      setCanvasActive(true);
    };
    const deactivate = () => {
      setCanvasActive(false);
      clearUnmountTimer();
      unmountTimer.current = window.setTimeout(() => {
        setCanvasMounted(false);
        setCanvasReady(false);
      }, 1400);
    };

    if (typeof IntersectionObserver !== "function") {
      const frame = window.requestAnimationFrame(activate);
      return () => {
        window.cancelAnimationFrame(frame);
        clearUnmountTimer();
      };
    }

    const observer = new IntersectionObserver(
      ([entry]) => (entry?.isIntersecting ? activate() : deactivate()),
      { rootMargin: "110% 0px", threshold: 0 },
    );
    observer.observe(element);
    return () => {
      observer.disconnect();
      clearUnmountTimer();
    };
  }, [canvasEnabled]);

  return (
    <div
      ref={root}
      className="experience-loader"
      data-canvas-ready={canvasReady ? "true" : "false"}
      data-canvas-active={canvasActive ? "true" : "false"}
      data-webgl-enabled={canvasEnabled ? "true" : "false"}
    >
      <ExperienceFallback showCopy={false} />
      {canvasEnabled && canvasMounted ? (
        <CanvasErrorBoundary onUnavailable={markCanvasUnavailable}>
          <DynamicExperienceCanvas
            active={canvasActive}
            compact={compact}
            onReady={markCanvasReady}
            onUnavailable={markCanvasUnavailable}
          />
        </CanvasErrorBoundary>
      ) : null}
    </div>
  );
}
