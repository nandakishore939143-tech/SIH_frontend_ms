import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * DataPoints — 5 subtle blue observation markers on the planet surface.
 * Synced rotation with EarthGlobe (0.018 rad/s).
 */

function latLonToVec3(lat, lon, r = 1.02) {
  const phi   = THREE.MathUtils.degToRad(90 - lat);
  const theta = THREE.MathUtils.degToRad(lon);
  return new THREE.Vector3(
    r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta)
  );
}

/* Five key observation locations */
const POINTS = [
  { lat:  40.7,  lon: -74.0 },  // New York
  { lat:  51.5,  lon:  -0.1 },  // London
  { lat:  35.7,  lon: 139.7 },  // Tokyo
  { lat: -33.9,  lon:  18.4 },  // Cape Town
  { lat:  19.1,  lon:  72.9 },  // Mumbai
];

function ObsPoint({ position, phase }) {
  const coreRef = useRef(null);
  const haloRef = useRef(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() + phase;
    if (haloRef.current) {
      haloRef.current.material.opacity  = 0.12 + 0.18 * Math.abs(Math.sin(t * 1.2));
      haloRef.current.scale.setScalar(0.85 + 0.6 * Math.abs(Math.sin(t * 0.7)));
    }
    if (coreRef.current) {
      coreRef.current.material.emissiveIntensity = 0.6 + 0.4 * Math.sin(t * 1.5);
    }
  });

  return (
    <group position={position}>
      {/* Core — satellite blue dot */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.010, 7, 7]} />
        <meshStandardMaterial
          color={new THREE.Color(0x4D8DFF)}
          emissive={new THREE.Color(0x2B6AE0)}
          emissiveIntensity={0.8}
          roughness={0.2}
          metalness={0.4}
        />
      </mesh>

      {/* Halo — subtle blue pulse */}
      <mesh ref={haloRef}>
        <sphereGeometry args={[0.022, 7, 7]} />
        <meshBasicMaterial
          color={new THREE.Color(0x4D8DFF)}
          transparent
          opacity={0.18}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

export default function DataPoints() {
  const groupRef = useRef(null);

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.018;
  });

  return (
    <group ref={groupRef}>
      {POINTS.map((p, i) => (
        <ObsPoint
          key={i}
          position={latLonToVec3(p.lat, p.lon)}
          phase={(i / POINTS.length) * Math.PI * 2}
        />
      ))}
    </group>
  );
}
