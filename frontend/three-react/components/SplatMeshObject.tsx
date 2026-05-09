"use client";

import { useEffect, useMemo } from "react";

import { createSplatMeshNode } from "@/three-core/spark/splatMeshNode";

type Props = {
  url: string;
};

export function SplatMeshObject({ url }: Props) {
  const mesh = useMemo(() => createSplatMeshNode(url), [url]);

  useEffect(() => {
    return () => {
      mesh.dispose();
    };
  }, [mesh]);

  return <primitive object={mesh} />;
}
