"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(callback: () => void) {
  if (typeof window.matchMedia !== "function") {
    return () => undefined;
  }
  const media = window.matchMedia(QUERY);
  media.addEventListener?.("change", callback);
  return () => media.removeEventListener?.("change", callback);
}

function getSnapshot() {
  return typeof window.matchMedia === "function"
    ? window.matchMedia(QUERY).matches
    : false;
}

export function useReducedMotion(): boolean | null {
  return useSyncExternalStore(subscribe, getSnapshot, () => null);
}
