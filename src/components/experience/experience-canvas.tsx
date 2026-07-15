"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { usePageVisibility } from "@/hooks/use-page-visibility";
import { ProductReveal } from "./product-reveal";

export const EXPERIENCE_BUDGET = {
  desktopDpr: 1.5,
  mobileDpr: 1,
  desktopRevealSubdivisions: [128, 128],
  mobileRevealSubdivisions: [72, 72],
} as const;

export type ExperienceCanvasProps = {
  compact: boolean;
  onReady?: () => void;
};

export function ExperienceCanvas({ compact, onReady }: ExperienceCanvasProps) {
  const pageVisible = usePageVisibility();
  const dpr = compact
    ? EXPERIENCE_BUDGET.mobileDpr
    : EXPERIENCE_BUDGET.desktopDpr;

  return (
    <div className="experience-canvas" aria-hidden="true">
      <Canvas
        camera={{ fov: 34, near: 0.1, far: 20, position: [0, 0, 4] }}
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
          <ProductReveal compact={compact} />
        </Suspense>
      </Canvas>
    </div>
  );
}
