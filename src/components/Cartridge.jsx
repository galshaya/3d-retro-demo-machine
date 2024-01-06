import React, { useRef } from 'react';
import { useGLTF, useTexture } from '@react-three/drei';
import { useSpring, a } from '@react-spring/three';

export function Cartridge({ name, active, originalPosition, onClick, stickerCover, originalRotation }) {
    const { nodes, materials } = useGLTF('/CARTRIDGE6.glb');
    const texture = useTexture(stickerCover);
    texture.flipY = false;

    const stickerMaterial = materials.sticker.clone();
    stickerMaterial.map = texture;
    stickerMaterial.needsUpdate = true;

    const groupRef = useRef();

    const { position, rotation } = useSpring({
        to: active ? [
            { position: [1, 5, 0], rotation: [0, 2 * Math.PI, Math.PI / -8] },
            { position: [1, 1, 0], rotation: [0, 2 * Math.PI, 0] }
        ] : { position: originalPosition, rotation: originalRotation },
        from: {
            position: originalPosition,
            rotation: originalRotation,
        },
        config: { mass: 3, tension: 350, friction: 50 },
    });

    const handlePointerOver = () => {
        document.body.style.cursor = 'pointer';
        groupRef.current.scale.set(1.05, 1.02, 1.02);
    };

    const handlePointerOut = () => {
        document.body.style.cursor = 'default';
        groupRef.current.scale.set(1, 1, 1);
    };

    return (
        <a.group 
            ref={groupRef}
            dispose={null} 
            position={position} 
            rotation={rotation} 
            onClick={() => onClick(name)}
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}
        >
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Cart.geometry}
                material={materials["Rough Plastic"]}
                scale={[0.35, 1, 1.7]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Tag.geometry}
                material={stickerMaterial}
            />
        </a.group>
    );
}

useGLTF.preload('/CARTRIDGE6.glb');
