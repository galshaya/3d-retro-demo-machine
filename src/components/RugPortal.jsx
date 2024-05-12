import React from "react";
import { useGLTF, MeshPortalMaterial, Environment } from "@react-three/drei";
import { PortalScene } from "./PortalScene";

export function RugPortal(props) {
  const { nodes, materials } = useGLTF("/rugportalsolo.glb");
  return (
    <group {...props} dispose={null}>
      <mesh
        geometry={nodes.Circle.geometry}
        material={nodes.Circle.material}
        position={[3.4, -2, 0]}
        scale={28.2}
        rotation={[Math.PI  ,0 , 0]}
      >
    <MeshPortalMaterial>
        {/* <Box args={[0.4,0.4, 0.4]} position={[0, 0, 0]} material-color="hotpink" /> */}
        <Environment preset="city"/>
        <ambientLight intensity={0.2} />
        <PortalScene />
    </MeshPortalMaterial>
    </mesh>
    </group>
  );
}

useGLTF.preload("/rugportalsolo.glb");