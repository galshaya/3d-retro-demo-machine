import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useControls, button } from 'leva';

export function AudioVisualizer({ isPlaying }) {
  const meshRef = useRef();
  const timeRef = useRef(0);

  // Debug controls for positioning and parameters
  const {
    posX, posY, posZ,
    rotX, rotY, rotZ,
    barCount, barSpacing, barWidth, barDepth,
    baseHeight, waveAmplitude, waveSpeed, waveOffset,
    opacity, color
  } = useControls('Audio Visualizer', {
    'Position': '',
    posX: { value: 0, min: -50, max: 50, step: 0.1 },
    posY: { value: 15, min: 0, max: 50, step: 0.1 },
    posZ: { value: -20, min: -50, max: 50, step: 0.1 },
    '---': '',
    'Rotation': '',
    rotX: { value: 0, min: -Math.PI, max: Math.PI, step: 0.01 },
    rotY: { value: 0, min: -Math.PI, max: Math.PI, step: 0.01 },
    rotZ: { value: 0, min: -Math.PI, max: Math.PI, step: 0.01 },
    '----': '',
    'Bars': '',
    barCount: { value: 12, min: 3, max: 24, step: 1 },
    barSpacing: { value: 2, min: 0.5, max: 5, step: 0.1 },
    barWidth: { value: 0.2, min: 0.1, max: 1, step: 0.05 },
    barDepth: { value: 0.2, min: 0.1, max: 1, step: 0.05 },
    '-----': '',
    'Animation': '',
    baseHeight: { value: 0.5, min: 0.1, max: 2, step: 0.1 },
    waveAmplitude: { value: 0.8, min: 0.1, max: 2, step: 0.1 },
    waveSpeed: { value: 3, min: 0.5, max: 10, step: 0.1 },
    waveOffset: { value: 0.5, min: 0.1, max: 2, step: 0.1 },
    '------': '',
    'Visual': '',
    opacity: { value: 0.15, min: 0.01, max: 1, step: 0.01 },
    color: { value: '#ffffff' },
    '------': '',
    'Copy Values': button(() => {
      const values = {
        position: [posX, posY, posZ],
        rotation: [rotX, rotY, rotZ],
        barCount,
        barSpacing,
        barWidth,
        barDepth,
        baseHeight,
        waveAmplitude,
        waveSpeed,
        waveOffset,
        opacity,
        color
      };

      const code = `// Audio Visualizer Settings
position={[${posX}, ${posY}, ${posZ}]}
rotation={[${rotX}, ${rotY}, ${rotZ}]}
barCount={${barCount}}
barSpacing={${barSpacing}}
barWidth={${barWidth}}
barDepth={${barDepth}}
baseHeight={${baseHeight}}
waveAmplitude={${waveAmplitude}}
waveSpeed={${waveSpeed}}
waveOffset={${waveOffset}}
opacity={${opacity}}
color="${color}"`;

      navigator.clipboard.writeText(code).then(() => {
        console.log('Settings copied to clipboard!');
        alert('Settings copied to clipboard!');
      });
    })
  });

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