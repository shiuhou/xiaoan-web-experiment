"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { ShaderMaterial } from "three";
import { useExperience } from "./experience-context";
import {
  SIGNAL_FIELD_FRAGMENT_SHADER,
  SIGNAL_FIELD_VERTEX_SHADER,
} from "@/shaders/signal-field";

export const SIGNAL_FIELD_BUDGET = {
  desktopPoints: 320,
  mobilePoints: 140,
} as const;

type FieldPoint = readonly [number, number, number];

function fract(value: number): number {
  return value - Math.floor(value);
}

function seeded(index: number, offset: number): number {
  return fract(Math.sin(index * 78.233 + offset * 37.719) * 43758.5453);
}

function smoothstep(start: number, end: number, value: number): number {
  const normalised = Math.min(1, Math.max(0, (value - start) / (end - start)));
  return normalised * normalised * (3 - 2 * normalised);
}

function mixPoint(from: FieldPoint, to: FieldPoint, amount: number): FieldPoint {
  return [
    from[0] + (to[0] - from[0]) * amount,
    from[1] + (to[1] - from[1]) * amount,
    from[2] + (to[2] - from[2]) * amount,
  ];
}

function getSignalFieldStages(index: number) {
  const lane = index % 5;
  const phase = index * 2.399963 + seeded(index, 2) * 0.28;
  const radius = 1.2 + seeded(index, 1) * 1.72;
  const raw: FieldPoint = [
    Math.cos(phase) * radius * 1.34,
    Math.sin(phase) * radius + (lane - 2) * 0.11,
    (seeded(index, 4) - 0.5) * 1.5,
  ];
  const aligned: FieldPoint = [
    (lane - 2) * 0.58,
    (seeded(index, 5) - 0.5) * 2.5,
    (seeded(index, 6) - 0.5) * 0.34,
  ];
  const row = Math.floor(index / 5) % 13;
  const compressed: FieldPoint = [
    (lane - 2) * 0.08,
    (row - 6) * 0.025,
    (seeded(index, 7) - 0.5) * 0.08,
  ];

  return { raw, aligned, compressed };
}

export function getSignalFieldPoint(index: number, progress: number): FieldPoint {
  const { raw, aligned, compressed } = getSignalFieldStages(index);
  const alignment = smoothstep(0.08, 0.58, progress);
  const compression = smoothstep(0.48, 0.94, progress);
  return mixPoint(mixPoint(raw, aligned, alignment), compressed, compression);
}

export function SignalField({ compact }: { compact: boolean }) {
  const { frame } = useExperience();
  const materialRef = useRef<ShaderMaterial>(null);
  const count = compact
    ? SIGNAL_FIELD_BUDGET.mobilePoints
    : SIGNAL_FIELD_BUDGET.desktopPoints;
  const attributes = useMemo(() => {
    const raw = new Float32Array(count * 3);
    const aligned = new Float32Array(count * 3);
    const compressed = new Float32Array(count * 3);
    const kinds = new Float32Array(count);

    for (let index = 0; index < count; index += 1) {
      const stages = getSignalFieldStages(index);
      raw.set(stages.raw, index * 3);
      aligned.set(stages.aligned, index * 3);
      compressed.set(stages.compressed, index * 3);
      kinds[index] = (index % 5) / 4;
    }

    return { raw, aligned, compressed, kinds };
  }, [count]);
  const uniforms = useMemo(
    () => ({
      uProgress: { value: 0 },
      uPointSize: { value: compact ? 2.25 : 2.8 },
    }),
    [compact],
  );

  useFrame(() => {
    const material = materialRef.current;
    if (material) {
      material.uniforms.uProgress.value = frame.current.signal;
    }
  });

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[attributes.raw, 3]} />
        <bufferAttribute
          attach="attributes-aAligned"
          args={[attributes.aligned, 3]}
        />
        <bufferAttribute
          attach="attributes-aCompressed"
          args={[attributes.compressed, 3]}
        />
        <bufferAttribute attach="attributes-aKind" args={[attributes.kinds, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        transparent
        depthWrite={false}
        toneMapped={false}
        vertexShader={SIGNAL_FIELD_VERTEX_SHADER}
        fragmentShader={SIGNAL_FIELD_FRAGMENT_SHADER}
        uniforms={uniforms}
      />
    </points>
  );
}
