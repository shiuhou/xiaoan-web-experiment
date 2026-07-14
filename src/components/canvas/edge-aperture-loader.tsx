"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { EdgeApertureFallback } from "./edge-aperture-fallback";

const DynamicEdgeAperture = dynamic(
  () => import("./edge-aperture").then((module) => module.EdgeAperture),
  {
    ssr: false,
    loading: () => <EdgeApertureFallback />,
  },
);

function canRenderWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGL2RenderingContext && canvas.getContext("webgl2"),
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

export function EdgeApertureLoader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [nearViewport, setNearViewport] = useState(false);
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

  useEffect(() => {
    const root = rootRef.current;
    if (WEBGL_FORCED_OFF) {
      return;
    }
    if (!root || typeof IntersectionObserver === "undefined") {
      setNearViewport(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNearViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin: "85% 0px", threshold: 0.01 },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={rootRef} className="edge-aperture-loader">
      {WEBGL_FORCED_OFF ||
      reducedMotion !== false ||
      webglAvailable !== true ||
      !nearViewport ? (
        <EdgeApertureFallback />
      ) : (
        <DynamicEdgeAperture compact={compact} />
      )}
    </div>
  );
}
