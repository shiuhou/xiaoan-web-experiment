"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { usePageVisibility } from "@/hooks/use-page-visibility";

export const EDGE_RENDER_BUDGET = {
  desktopParticles: 720,
  compactParticles: 280,
  desktopDpr: 1.35,
  compactDpr: 1,
} as const;

type ApertureFieldProps = {
  compact: boolean;
};

function seeded(index: number, salt: number) {
  const value = Math.sin(index * 17.17 + salt * 91.73) * 43758.5453;
  return value - Math.floor(value);
}

function smoothstep(value: number) {
  const clamped = THREE.MathUtils.clamp(value, 0, 1);
  return clamped * clamped * (3 - 2 * clamped);
}

export function getEdgeSignalPosition(
  index: number,
  progress: number,
): [number, number, number] {
  const mix = smoothstep(progress);
  const rawSignY = seeded(index, 3) > 0.5 ? 1 : -1;
  const rawSignZ = seeded(index, 4) > 0.5 ? 1 : -1;
  const raw: [number, number, number] = [
    -4.2 + seeded(index, 1) * 8.4,
    rawSignY * (0.8 + seeded(index, 5) * 1.25),
    rawSignZ * (0.65 + seeded(index, 6) * 1.65),
  ];
  const lane = (index % 3) - 1;
  const structured: [number, number, number] = [
    -4.15 + seeded(index, 7) * 8.3,
    lane * 0.24 + (seeded(index, 8) - 0.5) * 0.045,
    (index % 2 === 0 ? -1 : 1) * (0.13 + seeded(index, 9) * 0.07),
  ];

  return raw.map((value, axis) =>
    THREE.MathUtils.lerp(value, structured[axis], mix),
  ) as [number, number, number];
}

function SignalField({ compact }: ApertureFieldProps) {
  const points = useRef<THREE.Points>(null);
  const group = useRef<THREE.Group>(null);
  const count = compact
    ? EDGE_RENDER_BUDGET.compactParticles
    : EDGE_RENDER_BUDGET.desktopParticles;

  const { rawPositions, structuredPositions } = useMemo(() => {
    const raw = new Float32Array(count * 3);
    const structured = new Float32Array(count * 3);
    for (let index = 0; index < count; index += 1) {
      const rawPoint = getEdgeSignalPosition(index, 0);
      const structuredPoint = getEdgeSignalPosition(index, 1);
      raw.set(rawPoint, index * 3);
      structured.set(structuredPoint, index * 3);
    }
    return { rawPositions: raw, structuredPositions: structured };
  }, [count]);

  const positions = useMemo(() => rawPositions.slice(), [rawPositions]);

  useFrame((state) => {
    if (points.current) {
      const scene = document.querySelector<HTMLElement>(".edge-scene");
      const rect = scene?.getBoundingClientRect();
      const scrollable = Math.max(1, (rect?.height ?? 1) - window.innerHeight);
      const sceneProgress = rect
        ? THREE.MathUtils.clamp(-rect.top / scrollable, 0, 1)
        : 0;
      const processingMix = smoothstep((sceneProgress - 0.12) / 0.72);
      const attribute = points.current.geometry.getAttribute(
        "position",
      ) as THREE.BufferAttribute;
      const current = attribute.array as Float32Array;

      for (let index = 0; index < current.length; index += 1) {
        current[index] = THREE.MathUtils.lerp(
          rawPositions[index],
          structuredPositions[index],
          processingMix,
        );
      }
      attribute.needsUpdate = true;
      points.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.2) * 0.012;
    }
    if (group.current) {
      group.current.rotation.x = THREE.MathUtils.lerp(
        group.current.rotation.x,
        state.pointer.y * 0.055,
        0.035,
      );
      group.current.rotation.y = THREE.MathUtils.lerp(
        group.current.rotation.y,
        state.pointer.x * 0.09,
        0.035,
      );
    }
  });

  const rail = useMemo<[number, number, number][]>(
    () =>
      Array.from({ length: 42 }, (_, index) => {
        const progress = index / 41;
        return [
          -4.3 + progress * 8.6,
          Math.sin(progress * Math.PI * 3) * (1 - progress) * 0.22,
          Math.sin(progress * Math.PI) * 0.55,
        ];
      }),
    [],
  );

  return (
    <group ref={group}>
      <points ref={points}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color="#5ee7ff"
          opacity={compact ? 0.42 : 0.58}
          size={compact ? 0.026 : 0.021}
          sizeAttenuation
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      <group>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.26, 0.025, 12, 160]} />
          <meshBasicMaterial color="#a8f3ff" transparent opacity={0.75} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0.72]}>
          <torusGeometry args={[1.68, 0.009, 8, 140]} />
          <meshBasicMaterial color="#5ee7ff" transparent opacity={0.28} />
        </mesh>
        <mesh>
          <ringGeometry args={[0.48, 0.68, 96]} />
          <meshPhysicalMaterial
            color="#06151b"
            emissive="#0c5969"
            emissiveIntensity={0.38}
            roughness={0.18}
            metalness={0.42}
            transmission={0.52}
            transparent
            opacity={0.88}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh>
          <circleGeometry args={[0.28, 64]} />
          <meshBasicMaterial color="#dce5e2" transparent opacity={0.48} />
        </mesh>
      </group>

      {[-1.6, 0, 1.6].map((x, index) => (
        <mesh key={x} position={[x, 0, -0.38]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[1.7, 2.6]} />
          <meshBasicMaterial
            color={index === 1 ? "#a8f3ff" : "#5ee7ff"}
            transparent
            opacity={index === 1 ? 0.055 : 0.028}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}

      <Line points={rail} color="#5ee7ff" lineWidth={0.65} transparent opacity={0.34} />
      <Line
        points={rail.map(([x, y, z]) => [x, y - 0.42, z * -0.76])}
        color="#d79a56"
        lineWidth={0.45}
        transparent
        opacity={0.22}
      />
    </group>
  );
}

export function EdgeAperture({ compact = false }: { compact?: boolean }) {
  const pageVisible = usePageVisibility();
  const rootRef = useRef<HTMLDivElement>(null);
  const [inViewport, setInViewport] = useState(true);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof IntersectionObserver === "undefined") {
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setInViewport(entry.isIntersecting),
      { rootMargin: "18% 0px", threshold: 0.01 },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={rootRef} className="edge-aperture" data-edge-webgl="" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0.1, 6.2], fov: compact ? 56 : 48 }}
        dpr={compact ? [1, EDGE_RENDER_BUDGET.compactDpr] : [1, EDGE_RENDER_BUDGET.desktopDpr]}
        frameloop={pageVisible && inViewport ? "always" : "never"}
        gl={{ antialias: !compact, alpha: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.42} />
        <pointLight position={[2.5, 1.5, 3]} intensity={5} color="#5ee7ff" />
        <pointLight position={[-2, -1.4, 2]} intensity={2.2} color="#d79a56" />
        <SignalField compact={compact} />
      </Canvas>
    </div>
  );
}
