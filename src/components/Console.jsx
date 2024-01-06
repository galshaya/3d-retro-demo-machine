import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";

export function Console(props) {
  const { nodes, materials } = useGLTF("/CONSOLE 240101 bake version.glb");
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Roundcube001_Baked.geometry}
        material={materials["Roundcube.001_Baked"]}
        position={[1, 0.1,-2.12]}
        scale={[0.243, 0.066, 0.132]}
        rotation-y ={Math.PI}
      />
    </group>
  );
}

useGLTF.preload("/CONSOLE 240101 bake version.glb");

