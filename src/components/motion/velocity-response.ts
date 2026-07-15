export const VELOCITY_LIMITS = {
  normalisationPxPerSecond: 1600,
  skewDeg: 1.8,
  ribbonStretch: 1.12,
  chromaticOffsetPx: 4,
} as const;

export type VelocityResponse = {
  normalised: number;
  skewDeg: number;
  ribbonStretch: number;
  chromaticOffsetPx: number;
};

export function normaliseScrollVelocity(
  pxPerSecond: number,
  reducedMotion = false,
): number {
  if (reducedMotion || !Number.isFinite(pxPerSecond)) {
    return 0;
  }

  return Math.min(
    1,
    Math.max(-1, pxPerSecond / VELOCITY_LIMITS.normalisationPxPerSecond),
  );
}

export function getVelocityResponse(
  pxPerSecond: number,
  reducedMotion = false,
): VelocityResponse {
  const normalised = normaliseScrollVelocity(pxPerSecond, reducedMotion);

  return {
    normalised,
    skewDeg: normalised * VELOCITY_LIMITS.skewDeg,
    ribbonStretch:
      1 + Math.abs(normalised) * (VELOCITY_LIMITS.ribbonStretch - 1),
    chromaticOffsetPx: normalised * VELOCITY_LIMITS.chromaticOffsetPx,
  };
}
