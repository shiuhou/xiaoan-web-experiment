"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { usePageVisibility } from "@/hooks/use-page-visibility";
import { ProductReveal } from "./product-reveal";
import { SignalField } from "./signal-field";

export const EXPERIENCE_BUDGET = {
  desktopDpr: 1.5,
  mobileDpr: 1,
  desktopRevealSubdivisions: [128, 128],
  mobileRevealSubdivisions: [72, 72],
} as const;

export type ExperienceCanvasProps = {
  compact: boolean;
  mode?: "wake" | "signal";
  onReady?: () => void;
};

export function ExperienceCanvas({
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
          fov: mode === "signal" ? 42 : 34,
          near: 0.1,
          far: 20,
          position: [0, 0, mode === "signal" ? 5 : 4],
        }}
        dpr={dpr}
        frameloop={pageVisible ? "always" : "never"}
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
          ) : (
            <SignalField compact={compact} />
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}
