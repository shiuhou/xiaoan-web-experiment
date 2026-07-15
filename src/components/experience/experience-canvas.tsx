"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { usePageVisibility } from "@/hooks/use-page-visibility";
import { ProductReveal } from "./product-reveal";
import { SignalField } from "./signal-field";
import { EdgeTunnel } from "./edge-tunnel";

export const EXPERIENCE_BUDGET = {
  desktopDpr: 1.5,
  mobileDpr: 1,
  desktopRevealSubdivisions: [128, 128],
  mobileRevealSubdivisions: [72, 72],
} as const;

export type ExperienceCanvasProps = {
  active: boolean;
  compact: boolean;
  mode?: "wake" | "signal" | "edge";
  onReady?: () => void;
};

export function getExperienceFrameLoop(
  pageVisible: boolean,
  sceneVisible: boolean,
): "always" | "never" {
  return pageVisible && sceneVisible ? "always" : "never";
}

export function ExperienceCanvas({
  active,
  compact,
  mode = "wake",
  onReady,
}: ExperienceCanvasProps) {
  const pageVisible = usePageVisibility();
  const dpr = compact
    ? EXPERIENCE_BUDGET.mobileDpr
    : EXPERIENCE_BUDGET.desktopDpr;

  return (
    <div className="experience-canvas" aria-hidden="true">
      <Canvas
        camera={{
          fov: mode === "edge" ? 48 : mode === "signal" ? 42 : 34,
          near: 0.1,
          far: 20,
          position: [0, 0, mode === "edge" ? 5.4 : mode === "signal" ? 5 : 4],
        }}
        dpr={dpr}
        frameloop={getExperienceFrameLoop(pageVisible, active)}
        gl={{
          alpha: true,
          antialias: !compact,
          powerPreference: "high-performance",
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
          onReady?.();
        }}
      >
        <Suspense fallback={null}>
          {mode === "wake" ? (
            <ProductReveal compact={compact} />
          ) : mode === "signal" ? (
            <SignalField compact={compact} />
          ) : (
            <EdgeTunnel compact={compact} />
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}
