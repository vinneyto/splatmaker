"use client";

import { useThree } from "@react-three/fiber";
import { useEffect, useMemo } from "react";

import { createSparkRendererNode } from "@/three-core/spark/sparkRendererNode";

export function SparkRendererObject() {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);

  const sparkRenderer = useMemo(() => createSparkRendererNode(gl), [gl]);

  useEffect(() => {
    scene.add(sparkRenderer);
    return () => {
      scene.remove(sparkRenderer);
      sparkRenderer.dispose();
    };
  }, [scene, sparkRenderer]);

  return null;
}
