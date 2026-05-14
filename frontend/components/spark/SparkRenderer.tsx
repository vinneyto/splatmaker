"use client";

import { ThreeElement, extend, useThree } from "@react-three/fiber";
import { SparkRenderer as ThreeSparkRenderer } from "@sparkjsdev/spark";

extend({ SparkRenderer: ThreeSparkRenderer });

declare module "@react-three/fiber" {
  interface ThreeElements {
    sparkRenderer: ThreeElement<typeof ThreeSparkRenderer>;
  }
}

export function SparkRenderer() {
  const gl = useThree((state) => state.gl);

  return (
    <sparkRenderer
      args={[
        {
          renderer: gl,
          autoUpdate: true,
          enableLod: true,
        },
      ]}
    />
  );
}
