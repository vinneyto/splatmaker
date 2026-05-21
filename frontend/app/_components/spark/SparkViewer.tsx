"use client";

import { useEffect } from "react";

import { ClippingPreview, type ClippingPlacement } from "@/app/_components/clipping/clipping-preview";
import { SparkRenderer } from "@/app/_components/spark/spark-renderer";
import { RenderLayer } from "@/app/_lib/render-layers";
import { SortOrder } from "@/app/_lib/sort-order";
import { SplatMesh } from "@/app/_components/spark/splat-mesh";
import type { ActiveTool } from "@/app/_store/toolsSlice";
import { useSplatLod } from "@/app/_hooks/spark/use-splat-lod";

type Props = {
  url: string;
  activeTool: ActiveTool;
  onLodBuilt?: () => void;
  onLoad?: () => void;
};

export function SparkViewer({ url, activeTool, onLoad, onLodBuilt }: Props) {
  const { meshRef, sparkRendererArgs, splatMeshArgs } = useSplatLod({
    url,
    onLoad,
    onLodBuilt,
  });

  useEffect(() => {
    if (!meshRef.current) {
      return;
    }

    meshRef.current.layers.enable(RenderLayer.SplatMeshInteractive);
  }, [meshRef]);

  const handlePlace = (placement: ClippingPlacement) => {
    console.log("[clipping:onPlace]", placement);
  };

  return (
    <SparkRenderer args={[sparkRendererArgs]}>
      <SplatMesh ref={meshRef} args={[splatMeshArgs]} renderOrder={SortOrder.SplatMesh}>
        {activeTool === "clipping" && (
          <ClippingPreview
            type="cylinder"
            targetRef={meshRef}
            radius={0.5}
            height={2}
            onPlace={handlePlace}
          />
        )}
      </SplatMesh>
    </SparkRenderer>
  );
}
