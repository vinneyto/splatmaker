"use client";

import { SparkRenderer } from "@/app/_components/spark/spark-renderer";
import { SplatMesh } from "@/app/_components/spark/splat-mesh";
import { useSplatLod } from "@/app/_hooks/spark/use-splat-lod";

type Props = {
  url: string;
  onLodBuilt?: () => void;
  onLoad?: () => void;
};

export function SparkViewer({ url, onLoad, onLodBuilt }: Props) {
  const { meshRef, sparkRendererArgs, splatMeshArgs } = useSplatLod({
    url,
    onLoad,
    onLodBuilt,
  });

  return (
    <SparkRenderer args={[sparkRendererArgs]}>
      <SplatMesh ref={meshRef} args={[splatMeshArgs]} />
    </SparkRenderer>
  );
}
