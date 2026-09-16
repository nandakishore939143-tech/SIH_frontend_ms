import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import EarthGlobe from './EarthGlobe';
import Satellite from './Satellite';
import OrbitRing from './OrbitRing';
import DataPoints from './DataPoints';

/**
 * SpaceScene — Hero 3D canvas.
 * Planet positioned toward the right side; hero text lives on the left.
 * Lighting: warm directional key from upper-right, blue rim from left.
 */
export default function SpaceScene() {
  let webglOk = true;
  try {
    const c = document.createElement('canvas');
    webglOk = !!(c.getContext('webgl') || c.getContext('experimental-webgl'));
  } catch { webglOk = false; }

  if (!webglOk) return <CssFallback />;

  return (
    <div className="space-scene" aria-hidden="true">
      <Canvas
        camera={{ position: [-0.6, 0.2, 3.4], fov: 40 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
        style={{ background: 'transparent' }}
      >
        {/* Very dark ambient — barely visible */}
        <ambientLight intensity={0.04} />

        {/* Primary key light — warm off-white from upper-right (the "sun") */}
        <directionalLight
          position={[5, 3, 2]}
          intensity={1.1}
          color="#c8d8f0"
        />

        {/* Blue rim light — subtle atmospheric scatter from left */}
        <pointLight
          position={[-4, 0, 1]}
          intensity={0.35}
          color="#4D8DFF"
        />

        {/* Very faint fill from below to avoid pure black underside */}
        <pointLight
          position={[0, -3, 2]}
          intensity={0.08}
          color="#65C7FF"
        />

        <Suspense fallback={null}>
          <EarthGlobe />

          {/* Orbit rings — satellite blue, very subtle */}
          <OrbitRing radius={1.52} tilt={0.28}  speed={0}    color="#4D8DFF" opacity={0.22} />
          <OrbitRing radius={1.76} tilt={-0.42} speed={0}    color="#65C7FF" opacity={0.10} />

          {/* Orbiting satellite */}
          <Satellite orbitRadius={1.52} orbitTilt={0.28} speed={0.10} />

          {/* Observation data points */}
          <DataPoints />
        </Suspense>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={false}
          autoRotate={false}
        />
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
