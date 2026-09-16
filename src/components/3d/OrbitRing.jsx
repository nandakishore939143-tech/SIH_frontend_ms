import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * OrbitRing — a thin torus ring around the Earth.
 * @param {number}  radius   - torus ring radius
 * @param {number}  tilt     - X-axis tilt in radians
 * @param {number}  speed    - rotation speed (rad/s, for visual spinning if desired)
 * @param {string}  color    - hex color string
 * @param {number}  opacity  - transparency
 */
export default function OrbitRing({ radius = 1.5, tilt = 0, speed = 0, color = '#3b82f6', opacity = 0.3 }) {
  const ringRef = useRef(null);

  useFrame((_, delta) => {
    if (ringRef.current && speed !== 0) {
      ringRef.current.rotation.z += delta * speed * 0.1;
    }
  });

  return (
    <mesh ref={ringRef} rotation={[tilt, 0, 0]}>
      <torusGeometry args={[radius, 0.003, 8, 120]} />
      <meshBasicMaterial
        color={new THREE.Color(color)}
        transparent
        opacity={opacity}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}
