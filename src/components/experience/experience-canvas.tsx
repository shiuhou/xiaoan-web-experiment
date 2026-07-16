"use client";

import { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { usePageVisibility } from "@/hooks/use-page-visibility";
import { ProductReveal } from "./product-reveal";

export const EXPERIENCE_BUDGET = {
  desktopDpr: 1.5,
  mobileDpr: 1,
  desktopRevealSubdivisions: [1, 1],
  mobileRevealSubdivisions: [1, 1],
} as const;

export type ExperienceCanvasProps = {
  active: boolean;
  compact: boolean;
  onReady?: () => void;
  onUnavailable?: () => void;
};

export function getExperienceFrameLoop(
  pageVisible: boolean,
  sceneVisible: boolean,
): "always" | "never" {
  return pageVisible && sceneVisible ? "always" : "never";
}

function CanvasLifecycle({
  onReady,
  onUnavailable,
}: Pick<ExperienceCanvasProps, "onReady" | "onUnavailable">) {
  const { gl, invalidate } = useThree();
  const ready = useRef(false);

  useFrame(() => {
    if (!ready.current) {
      ready.current = true;
      onReady?.();
    }
  });

  useEffect(() => {
    const canvas = gl.domElement;
    const handleLost = (event: Event) => {
      event.preventDefault();
      ready.current = false;
      onUnavailable?.();
    };
    const handleRestored = () => {
      ready.current = false;
      invalidate();
    };
    canvas.addEventListener("webglcontextlost", handleLost);
    canvas.addEventListener("webglcontextrestored", handleRestored);
    return () => {
      canvas.removeEventListener("webglcontextlost", handleLost);
      canvas.removeEventListener("webglcontextrestored", handleRestored);
    };
  }, [gl, invalidate, onUnavailable]);

  return null;
}

export function ExperienceCanvas({
  active,
  compact,
  onReady,
  onUnavailable,
}: ExperienceCanvasProps) {
  const pageVisible = usePageVisibility();
  const dpr = compact
    ? EXPERIENCE_BUDGET.mobileDpr
    : EXPERIENCE_BUDGET.desktopDpr;

  return (
    <div className="experience-canvas" aria-hidden="true">
      <Canvas
        camera={{ fov: 34, near: 0.1, far: 20, position: [0, 0, 4] }}
        dpr={dpr}
        frameloop={getExperienceFrameLoop(pageVisible, active)}
        gl={{
          alpha: true,
          antialias: !compact,
          powerPreference: "high-performance",
        }}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      >
        <Suspense fallback={null}>
          <ProductReveal compact={compact} />
          <CanvasLifecycle
            onReady={onReady}
            onUnavailable={onUnavailable}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
