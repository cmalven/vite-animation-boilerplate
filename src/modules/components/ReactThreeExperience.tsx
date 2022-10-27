import { useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import React from 'react';
import { useRef } from 'react';
import type { Mesh } from 'three';

export default function ReactThreeExperience() {
  const cubeRef = useRef<Mesh>(null);

  useFrame(({ clock }, delta) => {
    if (!cubeRef.current) return;
    cubeRef.current.rotation.z += 0.8 * delta;
    cubeRef.current.rotation.y += 0.8 * delta;
    cubeRef.current.scale.x = cubeRef.current.scale.y = cubeRef.current.scale.z = Math.sin(clock.getElapsedTime()) + 1.5;
  });

  return (
    <>
      <directionalLight />
      <ambientLight intensity={0.2} />

      <OrbitControls
        enablePan={false}
        enableZoom={false}
      />
      
      <mesh ref={cubeRef}>
        <boxGeometry />
        <meshStandardMaterial />
      </mesh>
    </>
  );
}