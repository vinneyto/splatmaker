"use client";

import { ClippingPreview, type ClippingPlacement } from "@/app/_components/clipping/clipping-preview";
import { RENDER_ORDER } from "@/app/_components/clipping/render-order";
import { SparkRenderer } from "@/app/_components/spark/spark-renderer";
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

  const handlePlace = (placement: ClippingPlacement) => {
    console.log("[clipping:onPlace]", placement);
  };

  return (
    <SparkRenderer args={[sparkRendererArgs]}>
      <SplatMesh ref={meshRef} args={[splatMeshArgs]} renderOrder={RENDER_ORDER.SPLAT_MESH}>
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
