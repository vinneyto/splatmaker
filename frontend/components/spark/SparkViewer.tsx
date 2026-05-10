"use client";

import { SparkRenderer } from "@/components/spark/SparkRenderer";
import { SplatMesh } from "@/components/spark/SplatMesh";

type Props = {
  url: string;
};

export function SparkViewer({ url }: Props) {
  return (
    <>
      <SparkRenderer />
      <SplatMesh url={url} />
    </>
  );
}
