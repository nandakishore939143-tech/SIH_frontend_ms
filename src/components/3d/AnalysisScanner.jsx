import React, { useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* ─────────────────────────────────────
   Scanning target grid (circular)
───────────────────────────────────── */
function ScanTarget() {
  const ringRef  = useRef(null);
  const ring2Ref = useRef(null);
  const beamRef  = useRef(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    // Rings rotate at different speeds
    if (ringRef.current)  ringRef.current.rotation.z  = t * 0.6;
    if (ring2Ref.current) ring2Ref.current.rotation.z = -t * 0.35;

    // Beam sweeps around Y axis
    if (beamRef.current) beamRef.current.rotation.y = t * 1.4;
  });

  /* Radar sweep beam — thin flat triangle-ish plane using custom geometry */
  const beamGeo = React.useMemo(() => {
    const geo = new THREE.ConeGeometry(0.55, 0.001, 32, 1, true);
    return geo;
  }, []);

  return (
    <group>
      {/* Outer orbit ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.55, 0.006, 6, 80]} />
        <meshBasicMaterial
          color={new THREE.Color(0x3b82f6)}
          transparent
          opacity={0.5}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Inner dashed ring */}
      <mesh ref={ring2Ref} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.32, 0.004, 6, 60]} />
        <meshBasicMaterial
          color={new THREE.Color(0x60a5fa)}
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Crosshair lines */}
      {[0, Math.PI / 2].map((rot, i) => (
        <mesh key={i} rotation={[Math.PI / 2, rot, 0]}>
          <planeGeometry args={[1.1, 0.003]} />
          <meshBasicMaterial
            color={new THREE.Color(0x1e40af)}
            transparent
            opacity={0.4}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}

      {/* Radar sweep fan */}
      <mesh ref={beamRef} rotation={[Math.PI / 2, 0, 0]}>
        <mesh>
          <circleGeometry args={[0.55, 32, 0, Math.PI * 0.4]} />
          <meshBasicMaterial
            color={new THREE.Color(0x3b82f6)}
            transparent
            opacity={0.08}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      </mesh>

      {/* Center dot */}
      <mesh>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshBasicMaterial
          color={new THREE.Color(0x60a5fa)}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Corner markers */}
      {[
        [0.4, 0.4],  [-0.4, 0.4],
        [0.4, -0.4], [-0.4, -0.4],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 0, z]}>
          <sphereGeometry args={[0.012, 6, 6]} />
          <meshBasicMaterial
            color={new THREE.Color(0x93c5fd)}
            transparent
            opacity={0.7}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ─────────────────────────────────────
   Mini Satellite above the grid
───────────────────────────────────── */
function MiniSatellite() {
  const ref = useRef(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ref.current) {
      ref.current.position.y = 0.8 + 0.04 * Math.sin(t * 1.2);
      ref.current.rotation.z = Math.sin(t * 0.4) * 0.08;
    }
  });

  const bodyMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0x1e3a8a),
    roughness: 0.4,
    metalness: 0.8,
    emissive: new THREE.Color(0x1e40af),
    emissiveIntensity: 0.4,
  });
  const panelMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0x1d4ed8),
    roughness: 0.3,
    metalness: 0.9,
    emissive: new THREE.Color(0x3b82f6),
    emissiveIntensity: 0.6,
  });

  return (
    <group ref={ref} position={[0, 0.8, 0]}>
      {/* Body */}
      <mesh material={bodyMat}>
        <boxGeometry args={[0.12, 0.08, 0.08]} />
      </mesh>
      {/* Left panel */}
      <mesh position={[-0.16, 0, 0]} material={panelMat}>
        <boxGeometry args={[0.14, 0.055, 0.007]} />
      </mesh>
      {/* Right panel */}
      <mesh position={[0.16, 0, 0]} material={panelMat}>
        <boxGeometry args={[0.14, 0.055, 0.007]} />
      </mesh>
      {/* Antenna */}
      <mesh position={[0, 0.065, 0]} material={bodyMat}>
        <cylinderGeometry args={[0.005, 0.005, 0.045, 5]} />
      </mesh>

      {/* Scanning beam down toward the grid */}
      <ScanBeam />
    </group>
  );
}

function ScanBeam() {
  const ref = useRef(null);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ref.current) {
      ref.current.material.opacity = 0.06 + 0.04 * Math.sin(t * 3);
    }
  });

  return (
    <mesh ref={ref} position={[0, -0.4, 0]}>
      <coneGeometry args={[0.28, 0.8, 24, 1, true]} />
      <meshBasicMaterial
        color={new THREE.Color(0x3b82f6)}
        transparent
        opacity={0.08}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

/* ─────────────────────────────────────
   Exported AnalysisScanner
───────────────────────────────────── */
function SceneContents() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[3, 5, 3]} intensity={1.2} color="#c8d8ff" />
      <pointLight position={[-3, 2, 2]} intensity={0.8} color="#3b82f6" />

      <Suspense fallback={null}>
        <ScanTarget />
        <MiniSatellite />
      </Suspense>
    </>
  );
}

export default function AnalysisScanner() {
  /* WebGL check */
  let webglSupported = true;
  try {
    const c = document.createElement('canvas');
    webglSupported = !!(c.getContext('webgl') || c.getContext('experimental-webgl'));
  } catch { webglSupported = false; }

  if (!webglSupported) {
    return (
      <div className="sq-preview__placeholder" aria-label="No image uploaded">
        <div className="sq-preview__placeholder-icon" aria-hidden="true">
          <div className="sq-preview__radar" />
          <div className="sq-preview__radar sq-preview__radar--2" />
          <div className="sq-preview__radar sq-preview__radar--3" />
        </div>
        <p className="sq-preview__placeholder-title">Uploaded image will appear here</p>
        <p className="sq-preview__placeholder-hint">
          Start by uploading a satellite image<br />to begin analysis.
        </p>
      </div>
    );
  }

  return (
    <div className="sq-analysis-scanner" aria-label="Satellite scanning visualization" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 1.4, 2.2], fov: 38 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
        style={{ background: 'transparent', width: '100%', height: '100%' }}
      >
        <SceneContents />
      </Canvas>
      <p className="sq-analysis-scanner__hint">Upload an image to begin analysis</p>
    </div>
  );
}
