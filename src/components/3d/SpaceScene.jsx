import React, { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import EarthGlobe from './EarthGlobe';
import Satellite from './Satellite';
import OrbitRing from './OrbitRing';
import DataPoints from './DataPoints';

/**
 * useScrollProgress — tracks scroll position as 0→1 over document height
 */
function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(maxScroll > 0 ? Math.min(window.scrollY / maxScroll, 1) : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return progress;
}

/**
 * PlanetGroup — 3D group that responds to scroll for subtle parallax
 */
function PlanetGroup({ scrollProgress }) {
  const groupRef = useRef(null);
  const targetX = useRef(0);
  const targetZ = useRef(0);

  useFrame(() => {
    if (!groupRef.current) return;
    // Smooth lerp toward target position
    targetX.current = scrollProgress * 0.5;
    targetZ.current = -scrollProgress * 0.25;
    groupRef.current.position.x += (targetX.current - groupRef.current.position.x) * 0.05;
    groupRef.current.position.z += (targetZ.current - groupRef.current.position.z) * 0.05;
  });

  return (
    <group ref={groupRef}>
      <EarthGlobe />
      <OrbitRing radius={1.52} tilt={0.28}  speed={0} color="#4D8DFF" opacity={0.20} />
      <OrbitRing radius={1.76} tilt={-0.42} speed={0} color="#65C7FF" opacity={0.09} />
      <Satellite orbitRadius={1.52} orbitTilt={0.28} speed={0.10} />
      <DataPoints />
    </group>
  );
}

/**
 * SpaceScene — Hero 3D canvas with scroll parallax
 */
export default function SpaceScene() {
  let webglOk = true;
  try {
    const c = document.createElement('canvas');
    webglOk = !!(c.getContext('webgl') || c.getContext('experimental-webgl'));
  } catch { webglOk = false; }

  const scrollProgress = useScrollProgress();

  if (!webglOk) return <CssFallback />;

  return (
    <div className="space-scene" aria-hidden="true">
      <Canvas
        camera={{ position: [-0.6, 0.2, 3.4], fov: 40 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
        style={{ background: 'transparent' }}
      >
        {/* Very dark ambient */}
        <ambientLight intensity={0.04} />

        {/* Primary key light — warm "sun" from upper-right */}
        <directionalLight position={[5, 3, 2]} intensity={1.1} color="#c8d8f0" />

        {/* Blue rim light — atmospheric scatter */}
        <pointLight position={[-4, 0, 1]} intensity={0.38} color="#4D8DFF" />

        {/* Faint fill from below */}
        <pointLight position={[0, -3, 2]} intensity={0.08} color="#65C7FF" />

        <Suspense fallback={null}>
          <PlanetGroup scrollProgress={scrollProgress} />
        </Suspense>
      </Canvas>
    </div>
  );
}

function CssFallback() {
  return (
    <div className="space-scene-fallback" aria-hidden="true">
      <div className="space-scene-fallback__ring space-scene-fallback__ring--1" />
      <div className="space-scene-fallback__ring space-scene-fallback__ring--2" />
      <div className="space-scene-fallback__core" />
    </div>
  );
}
