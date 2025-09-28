import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export function AudioVisualizer({ isPlaying }) {
  const meshRef = useRef();
  const timeRef = useRef(0);

  // Audio Visualizer Settings - Final production parameters
  const posX = 34;
  const posY = 15;
  const posZ = 0;
  const rotX = 0;
  const rotY = 1.5;
  const rotZ = 0;
  const barCount = 12;
  const barSpacing = 1.4;
  const barWidth = 0.1;
  const barDepth = 0.1;
  const baseHeight = 0.5;
  const waveAmplitude = 0.4;
  const waveSpeed = 2.8;
  const waveOffset = 1.2;
  const opacity = 1;
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