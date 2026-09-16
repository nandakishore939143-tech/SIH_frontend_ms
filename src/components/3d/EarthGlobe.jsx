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

  /* Very slow, cinematic rotation */
  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.016;
    if (gridRef.current) gridRef.current.rotation.y += delta * 0.016;
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

  /* Atmosphere layers */
  const innerAtmosGeo = useMemo(() => new THREE.SphereGeometry(1.09, 32, 32), []);
  const midAtmosGeo   = useMemo(() => new THREE.SphereGeometry(1.16, 32, 32), []);
  const outerAtmosGeo = useMemo(() => new THREE.SphereGeometry(1.25, 32, 32), []);

  const innerAtmosMat = useMemo(() => new THREE.MeshBasicMaterial({
    color: new THREE.Color(0x0a2040),
    transparent: true,
    opacity: 0.22,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  }), []);

  const midAtmosMat = useMemo(() => new THREE.MeshBasicMaterial({
    color: new THREE.Color(0x051525),
    transparent: true,
    opacity: 0.12,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  }), []);

  const outerAtmosMat = useMemo(() => new THREE.MeshBasicMaterial({
    color: new THREE.Color(0x04101e),
    transparent: true,
    opacity: 0.06,
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
          color={new THREE.Color(0x020609)}
          roughness={0.94}
          metalness={0.04}
        />
      </mesh>

      {/* Lat/lon grid — very subtle blue-gray */}
      <lineSegments ref={gridRef} geometry={gridGeo}>
        <lineBasicMaterial
          color={new THREE.Color(0x142040)}
          transparent
          opacity={0.24}
        />
      </lineSegments>

      {/* Blue atmospheric rim — three layers for depth */}
      <mesh geometry={innerAtmosGeo} material={innerAtmosMat} />
      <mesh geometry={midAtmosGeo}   material={midAtmosMat}   />
      <mesh geometry={outerAtmosGeo} material={outerAtmosMat} />
    </group>
  );
}
