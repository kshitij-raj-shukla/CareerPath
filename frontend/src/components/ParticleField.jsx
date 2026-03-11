import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function ParticleWave({ width = 80, depth = 80 }) {
  const mesh = useRef();
  
  // Create a grid of particles
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < width; i++) {
        for(let j = 0; j < depth; j++) {
            const x = (i - width / 2) * 0.4;
            const z = (j - depth / 2) * 0.4;
            const y = 0;
            temp.push(x, y, z);
        }
    }
    return new Float32Array(temp);
  }, [width, depth]);

  useFrame(({ clock }) => {
    if (!mesh.current) return;
    const time = clock.getElapsedTime() * 0.6;
    const array = mesh.current.geometry.attributes.position.array;
    let i = 0;
    for (let ix = 0; ix < width; ix++) {
      for (let iz = 0; iz < depth; iz++) {
        // Calculate y with sine waves and perlin-like interference
        array[i + 1] = Math.sin((ix + time) * 0.15) * 1.5 + Math.cos((iz + time) * 0.15) * 1.5;
        i += 3;
      }
    }
    mesh.current.geometry.attributes.position.needsUpdate = true;
    // Slow ambient rotation
    mesh.current.rotation.y = Math.sin(time * 0.1) * 0.1;
  });

  return (
    <points ref={mesh} position={[0, -4, -10]} rotation={[0.3, 0, 0]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#818CF8"
        transparent
        opacity={0.5}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function FloatingGeometries() {
  const group = useRef();
  const shapes = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 10 + 2,
        (Math.random() - 0.5) * 15 - 5,
      ],
      scale: Math.random() * 0.6 + 0.3,
      speed: Math.random() * 0.3 + 0.1,
      offset: Math.random() * Math.PI * 2,
      color: ['#818CF8', '#C7D2FE', '#34D399', '#FBBF24', '#6366F1'][i % 5],
    }));
  }, []);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.getElapsedTime();
    group.current.children.forEach((child, i) => {
      const shape = shapes[i];
      child.position.y = shape.position[1] + Math.sin(t * shape.speed + shape.offset) * 1.5;
      child.position.x = shape.position[0] + Math.cos(t * shape.speed * 0.8 + shape.offset) * 1;
      child.rotation.x = t * shape.speed;
      child.rotation.y = t * shape.speed * 1.5;
    });
  });

  return (
    <group ref={group}>
      {shapes.map((shape, i) => (
        <mesh key={i} position={shape.position} scale={shape.scale}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color={shape.color}
            transparent
            opacity={0.3}
            wireframe
            emissive={shape.color}
            emissiveIntensity={0.8}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function ParticleField() {
  return (
    <div className="r3f-canvas fixed inset-0 z-0 pointer-events-none w-full h-full">
      <Canvas
        camera={{ position: [0, 2, 10], fov: 60 }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#C7D2FE" />
        <ParticleWave />
        <FloatingGeometries />
      </Canvas>
    </div>
  );
}
