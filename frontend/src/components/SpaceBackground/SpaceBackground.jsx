'use client';

import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

function seededRandom(index, salt = 0) {
  const value = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453;
  return value - Math.floor(value);
}

/* ------------------------------------------------------------------
   Star Field — layered point clouds for depth
   ------------------------------------------------------------------ */

function StarLayer({ count = 3000, radius = 100, spread = 100, size = 0.12, speed = 0.008 }) {
  const ref = useRef();

  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const r = radius + seededRandom(i, 1) * spread;
      const theta = seededRandom(i, 2) * Math.PI * 2;
      const phi = Math.acos(2 * seededRandom(i, 3) - 1);

      positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      /* subtle colour variation: mostly white, rare warm/cool tints */
      const roll = seededRandom(i, 4);
      if (roll > 0.96) {
        colors[i * 3] = 0.72; colors[i * 3 + 1] = 0.82; colors[i * 3 + 2] = 1.0;
      } else if (roll > 0.92) {
        colors[i * 3] = 1.0; colors[i * 3 + 1] = 0.88; colors[i * 3 + 2] = 0.72;
      } else {
        const w = 0.9 + seededRandom(i, 5) * 0.1;
        colors[i * 3] = w; colors[i * 3 + 1] = w; colors[i * 3 + 2] = w;
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute('color',    new THREE.Float32BufferAttribute(colors, 3));
    return geo;
  }, [count, radius, spread]);

  useFrame((_, delta) => {
    ref.current.rotation.y += delta * speed;
    ref.current.rotation.x += delta * speed * 0.25;
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        size={size}
        vertexColors
        transparent
        opacity={0.85}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}


/* ------------------------------------------------------------------
   Jupiter Model
   ------------------------------------------------------------------ */

function Jupiter() {
  const { scene } = useGLTF('/3dAssests/Jupiter_Model.glb');
  const ref = useRef();

  useFrame((_, delta) => {
    ref.current.rotation.y += delta * 0.04;
  });

  return (
    <group ref={ref} position={[4.5, -1.2, -6]} scale={2.8}>
      <primitive object={scene} />
    </group>
  );
}


/* ------------------------------------------------------------------
   Main Canvas
   ------------------------------------------------------------------ */

export default function SpaceBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0"
    >
      <Canvas
        camera={{ position: [0, 0, 1], fov: 60, near: 0.1, far: 1000 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
      >
        {/* Background colour + distance fog */}
        <color attach="background" args={['#0a0a0f']} />
        <fog attach="fog" args={['#0a0a0f', 90, 300]} />

        {/* Lighting for the planet */}
        <ambientLight intensity={0.35} />
        <directionalLight position={[8, 4, 4]} intensity={1.8} color="#ffeedd" />
        <pointLight position={[6, 1, -3]} intensity={1.6} color="#ffcc88" distance={40} />
        <pointLight position={[3, -2, -6]} intensity={0.9} color="#ffeedd" distance={35} />
        <pointLight position={[7, 3, -8]} intensity={0.6} color="#aaccff" distance={30} />

        {/* Star layers — far, mid, close */}
        <StarLayer count={4000} radius={100} spread={120} size={0.10} speed={0.006} />
        <StarLayer count={800}  radius={50}  spread={40}  size={0.18} speed={0.010} />
        <StarLayer count={120}  radius={30}  spread={25}  size={0.30} speed={0.014} />

        {/* Jupiter */}
        <Suspense fallback={null}>
          <Jupiter />
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload('/3dAssests/Jupiter_Model.glb');
