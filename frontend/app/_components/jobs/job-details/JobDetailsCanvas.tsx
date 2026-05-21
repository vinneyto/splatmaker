"use client";

import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

import { SparkViewer } from "@/app/_components/spark/SparkViewer";
import { isTouchMobileDevice } from "@/app/_components/jobs/job-details/utils";
import { useAppSelector } from "@/app/_store/hooks";

type Props = {
  url: string;
  onLoad: () => void;
  onLodBuilt: () => void;
};

export function JobDetailsCanvas({ url, onLoad, onLodBuilt }: Props) {
  const activeTool = useAppSelector((state) => state.tools.activeTool);
  const clippingPlacement = useAppSelector(
    (state) => state.tools.clippingPlacement,
  );

  const isClippingPlacementPhase =
    activeTool === "clipping" && !clippingPlacement;

  return (
    <Canvas
      camera={{ position: [0, 0, 3], fov: 60 }}
      gl={{ antialias: false }}
      dpr={[1, isTouchMobileDevice() ? 1 : 2]}
    >
      <color attach="background" args={["#111111"]} />
      <ambientLight intensity={0.6} />

      <SparkViewer
        url={url}
        activeTool={activeTool}
        clippingPlacement={clippingPlacement}
        onLoad={onLoad}
        onLodBuilt={onLodBuilt}
      />

      <OrbitControls
        enabled={!isClippingPlacementPhase}
        makeDefault
        enableDamping
        dampingFactor={0.12}
      />
    </Canvas>
  );
}
