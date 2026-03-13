"use client";

import { useState, useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import { useTheme } from "next-themes";

const StarSwarm = () => {
  const ref = useRef<any>(null);
  const { resolvedTheme } = useTheme();

  // Generate random points in a slightly larger space
  const [sphere] = useState(() => {
    const positions = new Float32Array(5000 * 3);
    for (let i = 0; i < 5000; i++) {
        // Random coordinates between -1.5 and 1.5
        positions[i * 3] = (Math.random() - 0.5) * 3;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 3;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 3;
    }
    return positions;
  });

  useFrame((state, delta) => {
    if (ref.current) {
        ref.current.rotation.x -= delta / 10;
        ref.current.rotation.y -= delta / 15;
    }
  });

  const dotColor = resolvedTheme === "dark" ? "#6366f1" : "#3b82f6"; // Indigo in dark, blue in light

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color={dotColor}
          size={0.005}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={resolvedTheme === "dark" ? 0.8 : 0.4}
        />
      </Points>
    </group>
  );
};

export const Stars3DBackground = () => {
  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none transition-colors duration-500 bg-neutral-50 dark:bg-[#030014]">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <Suspense fallback={null}>
          <StarSwarm />
        </Suspense>
      </Canvas>
    </div>
  );
};
