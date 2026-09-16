/* ══════════════════════════════════════════════
   EarthGlobe — Dark Futuristic Planet
   Color: Void black sphere + satellite blue rim
   ══════════════════════════════════════════════ */
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function EarthGlobe() {
  const meshRef = useRef(null);
  const gridRef = useRef(null);
  const atmoRef = useRef(null);

  /* Very slow, cinematic rotation */
  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.018;
    if (gridRef.current) gridRef.current.rotation.y += delta * 0.018;
  });

  /* Lat/lon grid geometry */
  const gridGeo = useMemo(() => {
    const points = [];
    const r = 1.005;

    // Latitude rings every 30°
    for (let lat = -60; lat <= 60; lat += 30) {
      const phi = THREE.MathUtils.degToRad(90 - lat);
      for (let i = 0; i <= 72; i++) {
        const theta = (i / 72) * Math.PI * 2;
        points.push(
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.cos(phi),
          r * Math.sin(phi) * Math.sin(theta)
        );
      }
    }

    // Longitude meridians every 30°
    for (let lon = 0; lon < 360; lon += 30) {
      const theta = THREE.MathUtils.degToRad(lon);
      for (let i = 0; i <= 72; i++) {
        const phi = (i / 72) * Math.PI;
        points.push(
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.cos(phi),
          r * Math.sin(phi) * Math.sin(theta)
        );
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
    return geo;
  }, []);

  /* Atmospheres */
  const innerAtmosGeo  = useMemo(() => new THREE.SphereGeometry(1.08, 32, 32), []);
  const outerAtmosGeo  = useMemo(() => new THREE.SphereGeometry(1.18, 32, 32), []);

  const innerAtmosMat = useMemo(() => new THREE.MeshBasicMaterial({
    color: new THREE.Color(0x0a1e40),
    transparent: true,
    opacity: 0.18,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  }), []);

  const outerAtmosMat = useMemo(() => new THREE.MeshBasicMaterial({
    color: new THREE.Color(0x04101e),
    transparent: true,
    opacity: 0.07,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  }), []);

  return (
    <group>
      {/* Main planet — void black sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          color={new THREE.Color(0x030810)}
          roughness={0.92}
          metalness={0.05}
        />
      </mesh>

      {/* Lat/lon grid — very subtle blue-gray */}
      <lineSegments ref={gridRef} geometry={gridGeo}>
        <lineBasicMaterial
          color={new THREE.Color(0x162848)}
          transparent
          opacity={0.28}
        />
      </lineSegments>

      {/* Blue atmospheric rim — inner */}
      <mesh geometry={innerAtmosGeo} material={innerAtmosMat} />

      {/* Blue atmospheric rim — outer (softer) */}
      <mesh geometry={outerAtmosGeo} material={outerAtmosMat} />
    </group>
  );
}
