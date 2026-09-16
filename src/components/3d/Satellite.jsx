import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Satellite — dark metallic body + deep-blue solar panels + cyan indicator light.
 * Professional, minimal. No cartoon colors.
 */
export default function Satellite({ orbitRadius = 1.52, orbitTilt = 0.28, speed = 0.10 }) {
  const groupRef = useRef(null);
  const bodyRef  = useRef(null);

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * speed;
    if (bodyRef.current)  bodyRef.current.rotation.y  += delta * 0.15;
  });

  const bodyMat = new THREE.MeshStandardMaterial({
    color:             new THREE.Color(0x0a1220),
    roughness:         0.45,
    metalness:         0.80,
    emissive:          new THREE.Color(0x060e1a),
    emissiveIntensity: 0.2,
  });

  const panelMat = new THREE.MeshStandardMaterial({
    color:             new THREE.Color(0x1a3060),
    roughness:         0.25,
    metalness:         0.85,
    emissive:          new THREE.Color(0x0d2040),
    emissiveIntensity: 0.35,
    transparent:       true,
    opacity:           0.92,
  });

  const glowMat = new THREE.MeshBasicMaterial({
    color:       new THREE.Color(0x65C7FF),
    transparent: true,
    opacity:     0.75,
    blending:    THREE.AdditiveBlending,
    depthWrite:  false,
  });

  return (
    <group rotation={[orbitTilt, 0, 0]}>
      <group ref={groupRef}>
        <group position={[orbitRadius, 0, 0]}>
          <group ref={bodyRef}>
            {/* Main body */}
            <mesh material={bodyMat}>
              <boxGeometry args={[0.055, 0.038, 0.038]} />
            </mesh>

            {/* Solar panel — left */}
            <mesh position={[-0.072, 0, 0]} material={panelMat}>
              <boxGeometry args={[0.060, 0.022, 0.003]} />
            </mesh>

            {/* Solar panel — right */}
            <mesh position={[0.072, 0, 0]} material={panelMat}>
              <boxGeometry args={[0.060, 0.022, 0.003]} />
            </mesh>

            {/* Antenna stub */}
            <mesh position={[0, 0.028, 0]} material={bodyMat}>
              <cylinderGeometry args={[0.002, 0.002, 0.018, 5]} />
            </mesh>

            {/* Cyan indicator glow */}
            <mesh position={[0, 0.038, 0]} material={glowMat}>
              <sphereGeometry args={[0.005, 6, 6]} />
            </mesh>

            {/* Center nav light */}
            <mesh material={glowMat}>
              <sphereGeometry args={[0.006, 6, 6]} />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
}
