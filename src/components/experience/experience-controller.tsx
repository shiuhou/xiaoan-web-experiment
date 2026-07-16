"use client";

import {
  type PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import type { ActId } from "@/content/v2-content";
import {
  clampProgress,
  createExperienceFrame,
  frameKeyForAct,
} from "@/lib/experience-state";
import { ExperienceContext } from "./experience-context";

const ACTS: readonly ActId[] = [
  "wake",
  "break",
  "signal",
  "edge-intent",
  "action",
  "presence",
];

function formatNumber(value: number): string {
  return Number(value.toFixed(4)).toString();
}

function rootStyle(): CSSStyleDeclaration | null {
  return typeof document === "undefined" ? null : document.documentElement.style;
}

export type ExperienceControllerProps = PropsWithChildren<{
  reducedMotion?: boolean;
}>;

export function ExperienceController({ children }: ExperienceControllerProps) {
  const frame = useRef(createExperienceFrame());

  const setActProgress = useCallback((act: ActId, value: number) => {
    const progress = clampProgress(value);
    frame.current[frameKeyForAct(act)] = progress;
    rootStyle()?.setProperty(
      `--experience-${act}-progress`,
      formatNumber(progress),
    );
  }, []);

  useEffect(() => {
    return () => {
      const style = rootStyle();
      for (const act of ACTS) {
        style?.removeProperty(`--experience-${act}-progress`);
      }
    };
  }, []);

  const value = useMemo(
    () => ({ frame, setActProgress }),
    [setActProgress],
  );

  return (
    <ExperienceContext.Provider value={value}>
      {children}
    </ExperienceContext.Provider>
  );
}
