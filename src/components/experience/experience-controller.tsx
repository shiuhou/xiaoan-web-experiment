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
import { getVelocityResponse } from "@/components/motion/velocity-response";
import { ExperienceContext } from "./experience-context";

const ACTS: readonly ActId[] = [
  "wake",
  "break",
  "signal",
  "edge-intent",
  "action",
  "presence",
];

const VELOCITY_PROPERTIES = [
  "--experience-velocity",
  "--experience-skew",
  "--experience-ribbon-stretch",
  "--experience-chromatic-offset",
] as const;

function formatNumber(value: number): string {
  return Number(value.toFixed(4)).toString();
}

function rootStyle(): CSSStyleDeclaration | null {
  return typeof document === "undefined" ? null : document.documentElement.style;
}

export type ExperienceControllerProps = PropsWithChildren<{
  reducedMotion: boolean;
}>;

export function ExperienceController({
  children,
  reducedMotion,
}: ExperienceControllerProps) {
  const frame = useRef(createExperienceFrame());

  const setActProgress = useCallback((act: ActId, value: number) => {
    const progress = clampProgress(value);
    frame.current[frameKeyForAct(act)] = progress;
    rootStyle()?.setProperty(
      `--experience-${act}-progress`,
      formatNumber(progress),
    );
  }, []);

  const setVelocity = useCallback(
    (pxPerSecond: number) => {
      const response = getVelocityResponse(pxPerSecond, reducedMotion);
      frame.current.velocity = response.normalised;

      const style = rootStyle();
      style?.setProperty(
        "--experience-velocity",
        formatNumber(response.normalised),
      );
      style?.setProperty(
        "--experience-skew",
        `${formatNumber(response.skewDeg)}deg`,
      );
      style?.setProperty(
        "--experience-ribbon-stretch",
        formatNumber(response.ribbonStretch),
      );
      style?.setProperty(
        "--experience-chromatic-offset",
        `${formatNumber(response.chromaticOffsetPx)}px`,
      );
    },
    [reducedMotion],
  );

  useEffect(() => {
    if (reducedMotion) {
      setVelocity(0);
    }
  }, [reducedMotion, setVelocity]);

  useEffect(() => {
    return () => {
      const style = rootStyle();
      for (const act of ACTS) {
        style?.removeProperty(`--experience-${act}-progress`);
      }
      for (const property of VELOCITY_PROPERTIES) {
        style?.removeProperty(property);
      }
    };
  }, []);

  const value = useMemo(
    () => ({ frame, setActProgress, setVelocity }),
    [setActProgress, setVelocity],
  );

  return (
    <ExperienceContext.Provider value={value}>
      {children}
    </ExperienceContext.Provider>
  );
}
