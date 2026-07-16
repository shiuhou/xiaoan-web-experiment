import type { ActId } from "@/content/v2-content";

export type ExperienceFrame = {
  wake: number;
  break: number;
  signal: number;
  edgeIntent: number;
  action: number;
  presence: number;
};

export type ExperienceActFrameKey = keyof ExperienceFrame;

const ACT_FRAME_KEYS: Record<ActId, ExperienceActFrameKey> = {
  wake: "wake",
  break: "break",
  signal: "signal",
  "edge-intent": "edgeIntent",
  action: "action",
  presence: "presence",
};

export function clampProgress(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.min(1, Math.max(0, value));
}

export function frameKeyForAct(act: ActId): ExperienceActFrameKey {
  return ACT_FRAME_KEYS[act];
}

export function createExperienceFrame(): ExperienceFrame {
  return {
    wake: 0,
    break: 0,
    signal: 0,
    edgeIntent: 0,
    action: 0,
    presence: 0,
  };
}
