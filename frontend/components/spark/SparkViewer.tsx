"use client";

import { SparkRenderer } from "@/components/spark/SparkRenderer";
import { SplatMesh } from "@/components/spark/SplatMesh";

type Props = {
  url: string;
  onLoad?: () => void;
};

export function SparkViewer({ url, onLoad }: Props) {
  return (
    <>
      <SparkRenderer />
      <SplatMesh url={url} onLoad={onLoad} />
    </>
  );
}
