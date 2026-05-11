import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

import { SparkViewer } from "@/components/spark/SparkViewer";
import { isTouchMobileDevice } from "@/components/jobs/job-details/utils";

type Props = {
  url: string;
  onLoad: () => void;
  onLodBuilt: () => void;
};

export function JobDetailsCanvas({ url, onLoad, onLodBuilt }: Props) {
  return (
    <Canvas
      camera={{ position: [0, 0, 3], fov: 60 }}
      gl={{ antialias: false }}
      dpr={[1, isTouchMobileDevice() ? 1 : 2]}
    >
      <color attach="background" args={["#111111"]} />
      <ambientLight intensity={0.6} />

      <SparkViewer url={url} onLoad={onLoad} onLodBuilt={onLodBuilt} />

      <OrbitControls makeDefault enableDamping dampingFactor={0.12} />
    </Canvas>
  );
}
