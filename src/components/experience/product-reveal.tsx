"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import {
  LinearMipmapLinearFilter,
  type ShaderMaterial,
  SRGBColorSpace,
  Vector2,
} from "three";
import { V2_ASSETS } from "@/content/v2-content";
import { useExperience } from "./experience-context";
import { EXPERIENCE_BUDGET } from "./experience-canvas";
import {
  PRODUCT_REVEAL_FRAGMENT_SHADER,
  PRODUCT_REVEAL_VERTEX_SHADER,
} from "@/shaders/product-reveal";

const PRODUCT_ASPECT = 1122 / 1402;

export function ProductReveal({ compact }: { compact: boolean }) {
  const texture = useTexture(V2_ASSETS.hero);
  const { frame } = useExperience();
  const { viewport } = useThree();
  const entranceStart = useRef<number | null>(null);
  const materialRef = useRef<ShaderMaterial>(null);
  const subdivisions = compact
    ? EXPERIENCE_BUDGET.mobileRevealSubdivisions
    : EXPERIENCE_BUDGET.desktopRevealSubdivisions;

  const configuredTexture = useMemo(() => {
    const clone = texture.clone();
    clone.colorSpace = SRGBColorSpace;
    clone.minFilter = LinearMipmapLinearFilter;
    clone.anisotropy = compact ? 2 : 4;
    clone.needsUpdate = true;
    return clone;
  }, [compact, texture]);
  const uniforms = useMemo(
    () => ({
      uTexture: { value: configuredTexture },
      uRevealProgress: { value: 0 },
      uPointer: { value: new Vector2(0.5, 0.5) },
    }),
    [configuredTexture],
  );

  useEffect(() => () => configuredTexture.dispose(), [configuredTexture]);

  useFrame((state) => {
    entranceStart.current ??= state.clock.elapsedTime;
    const elapsed = state.clock.elapsedTime - entranceStart.current;
    const linearEntrance = Math.min(1, elapsed / 1.6);
    const entrance = 1 - Math.pow(1 - linearEntrance, 4);
    const material = materialRef.current;
    if (!material) {
      return;
    }
    material.uniforms.uRevealProgress.value = Math.max(
      entrance,
      frame.current.wake,
    );

    if (compact) {
      material.uniforms.uPointer.value.set(0.5, 0.5);
    } else {
      material.uniforms.uPointer.value.set(
        (state.pointer.x + 1) * 0.5,
        (state.pointer.y + 1) * 0.5,
      );
    }
  });

  let height = viewport.height * 0.98;
  let width = height * PRODUCT_ASPECT;
  const maxWidth = viewport.width * 0.98;
  if (width > maxWidth) {
    width = maxWidth;
    height = width / PRODUCT_ASPECT;
  }

  return (
    <mesh scale={[width, height, 1]}>
      <planeGeometry args={[1, 1, subdivisions[0], subdivisions[1]]} />
      <shaderMaterial
        ref={materialRef}
        transparent
        depthWrite={false}
        toneMapped={false}
        vertexShader={PRODUCT_REVEAL_VERTEX_SHADER}
        fragmentShader={PRODUCT_REVEAL_FRAGMENT_SHADER}
        uniforms={uniforms}
      />
    </mesh>
  );
}
