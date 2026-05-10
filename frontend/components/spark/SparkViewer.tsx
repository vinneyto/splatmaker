"use client";

import { SparkRendererObject } from "@/components/spark/SparkRendererObject";
import { SplatMeshObject } from "@/components/spark/SplatMeshObject";

type Props = {
  url: string;
};

export function SparkViewer({ url }: Props) {
  return (
    <>
      <SparkRendererObject />
      <SplatMeshObject url={url} />
    </>
  );
}
