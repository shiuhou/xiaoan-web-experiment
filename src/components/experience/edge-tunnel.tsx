"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { ShaderMaterial } from "three";
import { useExperience } from "./experience-context";
import {
  EDGE_TUNNEL_FRAGMENT_SHADER,
  EDGE_TUNNEL_VERTEX_SHADER,
} from "@/shaders/edge-tunnel";

export const TUNNEL_BUDGET = {
  desktopPoints: 720,
  mobilePoints: 300,
} as const;

type TunnelPoint = readonly [number, number, number];

function fract(value: number): number {
  return value - Math.floor(value);
}

function seeded(index: number, offset: number): number {
  return fract(Math.sin(index * 91.731 + offset * 23.117) * 41317.391);
}

function smoothstep(start: number, end: number, value: number): number {
  const normalised = Math.min(1, Math.max(0, (value - start) / (end - start)));
  return normalised * normalised * (3 - 2 * normalised);
}

function mixPoint(from: TunnelPoint, to: TunnelPoint, amount: number): TunnelPoint {
  return [
    from[0] + (to[0] - from[0]) * amount,
    from[1] + (to[1] - from[1]) * amount,
    from[2] + (to[2] - from[2]) * amount,
  ];
}

function getTunnelStages(index: number) {
  const lane = index % 3;
  const longitudinal = (index % 181) / 180;
  const ySeed = seeded(index, 1);
  const zSeed = seeded(index, 2);
  const raw: TunnelPoint = [
    -3.5 + longitudinal * 7,
    (ySeed > 0.5 ? 1 : -1) * (0.82 + ySeed * 1.42),
    (zSeed > 0.5 ? 1 : -1) * (0.68 + zSeed * 1.18),
  ];
  const row = Math.floor(index / 3) % 11;
  const ordered: TunnelPoint = [
    -3.5 + longitudinal * 7,
    (lane - 1) * 0.37,
    (row - 5) * 0.026,
  ];

  return { raw, ordered, lane };
}

export function getTunnelPoint(index: number, progress: number): TunnelPoint {
  const { raw, ordered } = getTunnelStages(index);
  return mixPoint(raw, ordered, smoothstep(0.08, 0.9, progress));
}

export function EdgeTunnel({ compact }: { compact: boolean }) {
  const { frame } = useExperience();
  const materialRef = useRef<ShaderMaterial>(null);
  const count = compact
    ? TUNNEL_BUDGET.mobilePoints
    : TUNNEL_BUDGET.desktopPoints;
  const attributes = useMemo(() => {
    const raw = new Float32Array(count * 3);
    const ordered = new Float32Array(count * 3);
    const lanes = new Float32Array(count);

    for (let index = 0; index < count; index += 1) {
      const point = getTunnelStages(index);
      raw.set(point.raw, index * 3);
      ordered.set(point.ordered, index * 3);
      lanes[index] = point.lane / 2;
    }

    return { raw, ordered, lanes };
  }, [count]);
  const uniforms = useMemo(
    () => ({
      uProgress: { value: 0 },
      uVelocity: { value: 0 },
      uPointSize: { value: compact ? 2.2 : 2.75 },
    }),
    [compact],
  );

  useFrame(() => {
    const material = materialRef.current;
    if (!material) {
      return;
    }
    material.uniforms.uProgress.value = frame.current.edgeIntent;
    material.uniforms.uVelocity.value = frame.current.velocity;
  });

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[attributes.raw, 3]} />
        <bufferAttribute
          attach="attributes-aOrdered"
          args={[attributes.ordered, 3]}
        />
        <bufferAttribute attach="attributes-aLane" args={[attributes.lanes, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        transparent
        depthWrite={false}
        toneMapped={false}
        vertexShader={EDGE_TUNNEL_VERTEX_SHADER}
        fragmentShader={EDGE_TUNNEL_FRAGMENT_SHADER}
        uniforms={uniforms}
      />
    </points>
  );
}
