'use client';

import { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';

/* ------------------------------------------------------------------
   Jupiter — bottom-right, large, matches mockup planet position
   ------------------------------------------------------------------ */
function Jupiter() {
  const { scene } = useGLTF('/3dAssests/Jupiter_Model.glb');
  const ref = useRef();
  useFrame((_, delta) => { ref.current.rotation.y += delta * 0.03; });
  return (
    <group ref={ref} position={[5.2, -2.8, -5]} scale={4.2}>
      <primitive object={scene} />
    </group>
  );
}

/* ------------------------------------------------------------------
   Main SpaceBackground
   Layer order (bottom → top):
   1. base bg.webp        — static nebula/space image
   2. stars.mp4           — animated star overlay (mix-blend: screen)
   3. dark vignette       — keeps centre readable
   4. R3F canvas          — Jupiter 3D model (transparent bg)
   ------------------------------------------------------------------ */
export default function SpaceBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">

      {/* 1 — Base background image */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'url(/landingPage/base%20bg.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* 2 — Stars video overlay */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
        style={{ mixBlendMode: 'screen', opacity: 0.6 }}
      >
        <source src="/landingPage/stars.mp4" type="video/mp4" />
      </video>

      {/* 3 — Vignette: darkens edges, keeps centre content readable */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 70% 60% at 45% 45%, transparent 20%, rgba(4,4,12,0.45) 100%),
            linear-gradient(to bottom, rgba(4,4,12,0.3) 0%, transparent 25%, transparent 65%, rgba(4,4,12,0.7) 100%)
          `,
        }}
      />

      {/* 4 — Jupiter R3F (transparent canvas) */}
      <Canvas
        className="absolute inset-0 h-full w-full"
        camera={{ position: [0, 0, 1], fov: 60, near: 0.1, far: 1000 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[8, 4, 4]}   intensity={2.0} color="#ffeedd" />
        <pointLight      position={[6, 1, -3]}   intensity={1.8} color="#ffcc88" distance={50} />
        <pointLight      position={[3, -2, -6]}  intensity={1.0} color="#ffeedd" distance={40} />
        <pointLight      position={[7, 3, -8]}   intensity={0.7} color="#ffaacc" distance={35} />
        <Suspense fallback={null}>
          <Jupiter />
        </Suspense>
      </Canvas>

    </div>
  );
}

useGLTF.preload('/3dAssests/Jupiter_Model.glb');
