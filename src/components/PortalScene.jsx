import React, { useRef, useEffect } from 'react';
import { useGLTF, useAnimations, Float } from '@react-three/drei';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';

export function PortalScene(props) {
    const group = useRef();
    const { nodes, materials, animations } = useGLTF('/object 0512.glb');
    const { actions } = useAnimations(animations, group);
    const { gl } = useThree();
    
    const handleClick = (url) => {
        window.open(url, '_blank');
    };

    const handlePointerOver = () => {
        gl.domElement.style.cursor = 'pointer';
    };

    const handlePointerOut = () => {
        gl.domElement.style.cursor = 'default';
    };

    useEffect(() => {
        const action = actions['VortexRibbonObjectAction.001'];
        if (action) {
            action.reset().setLoop(THREE.LoopRepeat).play();
        }
    }, [actions]);

    return (
        <group ref={group} {...props} dispose={null}>
            <group name="Scene">
                <group name="Empty" position={[0, -1, 0]} scale={0.53} rotation={[0, Math.PI / 1.1, -Math.PI / 2]}>
                    {nodes.Text && (
                        <mesh
                            name="Text"
                            castShadow
                            receiveShadow
                            geometry={nodes.Text.geometry}
                            material={materials['Material.002']}
                            position={[-2.609, 0.498, -0.476]}
                            rotation={[Math.PI / 2, 0, Math.PI / 2]}
                            scale={0.249}
                        />
                    )}
                    {nodes.VortexRibbonObject && (
                        <mesh
                            name="VortexRibbonObject"
                            castShadow
                            receiveShadow
                            geometry={nodes.VortexRibbonObject.geometry}
                            material={materials['Material.001']}
                        />
                    )}
                </group>
                <group name="cards" position={[0.1, -1.2, -0.1]} scale={0.66} rotation={[0, Math.PI / 1.1, 0]}>
                    {nodes.AKT5 && (
                        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
                            <mesh
                                name="AKT5"
                                castShadow
                                receiveShadow
                                geometry={nodes.AKT5.geometry}
                                material={materials['Material.003']}
                                onClick={() => handleClick('https://www.youtube.com/watch?v=F24bwYweC-M&ab_channel=GalShaya')}
                                onPointerOver={handlePointerOver}
                                onPointerOut={handlePointerOut}
                            />
                        </Float>
                    )}
                    {nodes.QUINTET && (
                        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
                            <mesh
                                name="QUINTET"
                                castShadow
                                receiveShadow
                                geometry={nodes.QUINTET.geometry}
                                material={materials['Material.004']}
                                onClick={() => handleClick('https://soundcloud.com/galshaya/pesach?si=dbba848795704f10ba3ec0900d583dc0&utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing')}
                                onPointerOver={handlePointerOver}
                                onPointerOut={handlePointerOut}
                            />
                        </Float>
                    )}
                    {nodes.TENOR_BADNESS && (
                        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
                            <mesh
                                name="TENOR_BADNESS"
                                castShadow
                                receiveShadow
                                geometry={nodes.TENOR_BADNESS.geometry}
                                material={materials['Material.005']}
                                onClick={() => handleClick('https://www.youtube.com/watch?v=U4hyPcjZXFc&ab_channel=GalShaya')}
                                onPointerOver={handlePointerOver}
                                onPointerOut={handlePointerOut}
                            />
                        </Float>
                    )}
                </group>
            </group>
        </group>
    );
}

useGLTF.preload('/object 0512.glb');
