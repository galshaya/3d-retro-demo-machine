import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";

export function Room(props) {
  const { nodes, materials } = useGLTF("/room with textures test.glb");
  return (
    <group rotation = {[0,Math.PI*1,0]} {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube001.geometry}
        material={materials["Material.005"]}
        position={[-13.945, 1.836, -17.654]}
        rotation={[-Math.PI, -0.507, 0]}
        scale={[4.2, 3.28, 2.286]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.parlourGuitar_string_G_001.geometry}
        material={materials["Material.012"]}
        position={[0.088, 0.099, 0.001]}
        scale={0.408}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Picture_frame.geometry}
        material={materials["Material.009"]}
        position={[-18.781, 11.964, 8.224]}
        rotation={[0, 0.348, 0.344]}
        scale={[0.29, 1.24, 1.099]}
      />
      <group
        position={[-18.645, 11.631, -8.666]}
        rotation={[-Math.PI, 0.811, -Math.PI]}
        scale={-13.348}
      >
        <mesh
          castShadow
          receiveShadow
          geometry={nodes["Cover_book-01"].geometry}
          material={materials["Basic_Material.002"]}
          rotation={[0, -Math.PI / 2, 0]}
        />
      </group>
      <group position={[-4.526, -1.554, 0]} scale={34.798}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Rug.geometry}
          material={materials["Basic_Material.003"]}
          position={[0.007, -0.006, 0.002]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Rug_Frame.geometry}
          material={materials.Basic_Material}
          position={[0.007, 0, 0.002]}
        />
      </group>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube_027.geometry}
        material={materials["Material.007"]}
        position={[-13.781, 6.602, -17.525]}
        rotation={[-Math.PI / 2, 0, 0.507]}
        scale={[-3.491, -1.319, -1.439]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube_002.geometry}
        material={materials["Material.008"]}
        position={[-12.389, 0.438, 16.822]}
        rotation={[0, 0.63, 0]}
        scale={[2.796, 1.929, 2.796]}
      />
      <group rotation={[Math.PI / 2, 0, 0]}>
        <group position={[0, 0, -0.682]}>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube003.geometry}
            material={materials.Material_0}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube003_1.geometry}
            material={materials.Material_1}
          />
        </group>
      </group>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube_008.geometry}
        material={materials["Material.011"]}
        position={[0.794, 3.73, 20.624]}
        rotation={[0, -0.524, 0]}
      />
      <group position={[-11.72, 2.371, 16.339]} scale={20.985}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Flowers.geometry}
          material={materials.Basic_Material}
          position={[-0.003, 0.094, -0.016]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Ground.geometry}
          material={materials.Basic_Material}
          position={[0, 0.094, 0.001]}
        />
      </group>
      <group
        position={[4.379, -1.165, -19.637]}
        rotation={[0, 0.022, 0]}
        scale={10.464}
      >
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Grey.geometry}
          material={materials["Basic_Material.001"]}
          position={[0.303, 0, 0]}
        />
      </group>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.PRECISION_BASS.geometry}
        material={materials["Material.004"]}
        position={[-11.018, 4.068, -16.797]}
        rotation={[1.357, 0.127, -0.644]}
        scale={11.548}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Bobbin_tape_recorder.geometry}
        material={materials["Material.003"]}
        position={[6.836, 4.629, -19.645]}
        scale={6.059}
      />
    </group>
  );
}

useGLTF.preload("/room with textures test.glb");

