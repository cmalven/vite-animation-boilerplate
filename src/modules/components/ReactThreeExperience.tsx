import { useFrame } from '@react-three/fiber';
import { OrbitControls, PivotControls } from '@react-three/drei';
import React from 'react';
import { useRef } from 'react';
import type { Mesh } from 'three';
import { useSpring, animated } from '@react-spring/three';
import { useControls } from 'leva';

export default function ReactThreeExperience() {
  // Refs
  const cubeRef = useRef<Mesh>(null);

  // GUI
  const animation = useControls('animation', {
    rotationSpeed: {
      value: 0.8,
      min: 0,
      max: 3,
    },
  });

  // Frame-based animation
  useFrame(({ clock }, delta) => {
    if (!cubeRef.current) return;
    cubeRef.current.rotation.z += animation.rotationSpeed * delta;
    cubeRef.current.rotation.y += animation.rotationSpeed * delta;
    // cubeRef.current.scale.x = cubeRef.current.scale.y = cubeRef.current.scale.z = Math.sin(clock.getElapsedTime()) + 1.5;
  });

  // Spring-based animation
  const [active, setActive] = React.useState(false);
  const { scale } = useSpring({ scale: active ? 2 : 1 });

  return (
    <>
      <directionalLight />
      <ambientLight intensity={0.2} />

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        makeDefault
      />

      <PivotControls depthTest={false} scale={2} lineWidth={3}>
        <animated.mesh
          ref={cubeRef}
          onClick={() => setActive(!active)}
          scale={scale}
        >
          <boxGeometry />
          <meshStandardMaterial />
        </animated.mesh>
      </PivotControls>
    </>
  );
}