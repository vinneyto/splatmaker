"use client";

import { SparkRenderer } from "@/components/spark/SparkRenderer";
import { SplatMesh } from "@/components/spark/SplatMesh";

type Props = {
  url: string;
  onLodBuilt?: () => void;
  onLoad?: () => void;
};

export function SparkViewer({ url, onLoad, onLodBuilt }: Props) {
  return (
    <>
      <SparkRenderer />
      <SplatMesh key={url} url={url} onLoad={onLoad} onLodBuilt={onLodBuilt} />
    </>
  );
}
