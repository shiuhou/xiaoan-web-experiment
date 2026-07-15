"use client";

import {
  createContext,
  type MutableRefObject,
  useContext,
} from "react";
import type { ActId } from "@/content/v2-content";
import type { ExperienceFrame } from "@/lib/experience-state";

export type ExperienceControllerValue = {
  frame: MutableRefObject<ExperienceFrame>;
  setActProgress: (act: ActId, value: number) => void;
  setVelocity: (pxPerSecond: number) => void;
};

export const ExperienceContext =
  createContext<ExperienceControllerValue | null>(null);

export function useExperience(): ExperienceControllerValue {
  const controller = useContext(ExperienceContext);
  if (!controller) {
    throw new Error("useExperience must be used inside ExperienceController");
  }
  return controller;
}
