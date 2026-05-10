"use client";

import { useThree } from "@react-three/fiber";
import { SparkRenderer as ThreeSparkRenderer } from "@sparkjsdev/spark";
import { useEffect, useMemo } from "react";

export function SparkRenderer() {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);

  const sparkRenderer = useMemo(
    () =>
      new ThreeSparkRenderer({
        renderer: gl,
        autoUpdate: true,
      }),
    [gl],
  );

  useEffect(() => {
    scene.add(sparkRenderer);

    return () => {
      scene.remove(sparkRenderer);
      sparkRenderer.dispose();
    };
  }, [scene, sparkRenderer]);

  return null;
}
