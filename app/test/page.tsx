"use client";

import { OrbitControls } from "@react-three/drei";
import { useLoader, useFrame, Canvas } from "@react-three/fiber";
import React, { Suspense, useRef } from "react";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const GltfModel = ({ modelPath, scale = 40, position = [0, 0, 0] }: any) => {
  const ref = useRef();
  const gltf = useLoader(GLTFLoader, modelPath);

  useFrame((state, delta) => {
    if (ref.current) {
      (ref.current as THREE.Object3D).rotation.y += 0.003;
    }
  });
  return <primitive ref={ref} object={(gltf as GLTF).scene} position={position} />;
};

const ModelViewer = ({ modelPath, scale = 40, position = [0, 0, 0] }: any) => {
  return (
    <Canvas style={{ width: "50%", height: "100vh" }}>
      <ambientLight intensity={0.3} />
      <spotLight position={[10, 10, 10]} angle={0.25} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />
      <Suspense fallback={null}>
        <GltfModel modelPath={modelPath} scale={scale} position={position} />
        <OrbitControls
          enableZoom={false}
          enableRotate={true}
          enablePan={false}
          enableDamping
          dampingFactor={0.2}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
          maxAzimuthAngle={Math.PI}
          minAzimuthAngle={-Math.PI}
          screenSpacePanning={true}
        />
      </Suspense>
    </Canvas>
  );
};

export default function Page() {
  return <ModelViewer scale={0.5} modelPath={"/test.glb"} />;
}
