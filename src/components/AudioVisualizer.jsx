import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export function AudioVisualizer({ isPlaying }) {
  const meshRef = useRef();
  const timeRef = useRef(0);

  // Hardcoded final parameters
  const posX = 0;
  const posY = 15;
  const posZ = -20;
  const rotX = 0;
  const rotY = 0;
  const rotZ = 0;
  const barCount = 12;
  const barSpacing = 2;
  const barWidth = 0.2;
  const barDepth = 0.2;
  const baseHeight = 0.5;
  const waveAmplitude = 0.8;
  const waveSpeed = 3;
  const waveOffset = 0.5;
  const opacity = 0.15;
  const color = '#ffffff';

  // Animation loop - waveform-style visualization
  useFrame((state, delta) => {
    if (meshRef.current && isPlaying) {
      timeRef.current += delta;

      // Update each bar's height to create waveform effect
      meshRef.current.children.forEach((child, i) => {
        if (child.isMesh) {
          const waveHeight = Math.sin(timeRef.current * waveSpeed + i * waveOffset) * waveAmplitude + 1;
          child.scale.y = baseHeight + waveHeight;
        }
      });
    }
  });

  if (!isPlaying) return null;

  return (
    <group ref={meshRef} position={[posX, posY, posZ]} rotation={[rotX, rotY, rotZ]}>
      {/* Controllable waveform-style bars */}
      {Array.from({ length: barCount }, (_, i) => {
        const x = (i - (barCount - 1) / 2) * barSpacing; // Center the bars

        return (
          <mesh
            key={i}
            position={[x, 0, 0]}
            scale={[barWidth, baseHeight, barDepth]}
          >
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={opacity}
            />
          </mesh>
        );
      })}
    </group>
  );
}