"use client";

import { useEffect } from "react";

import { ClippingPreview } from "@/app/_components/clipping/clipping-preview";
import { CylinderClipping } from "@/app/_components/clipping/cylinder-clipping";
import { SparkRenderer } from "@/app/_components/spark/spark-renderer";
import { SplatMesh } from "@/app/_components/spark/splat-mesh";
import { RenderLayer } from "@/app/_lib/render-layers";
import { SortOrder } from "@/app/_lib/sort-order";
import type { ClippingPlacement } from "@/app/_lib/types/clipping";
import { useAppDispatch } from "@/app/_store/hooks";
import {
  setClippingPlacement,
  updateCylinderClippingDimensions,
  type ActiveTool,
} from "@/app/_store/toolsSlice";
import { useSplatLod } from "@/app/_hooks/spark/use-splat-lod";

type Props = {
  url: string;
  activeTool: ActiveTool;
  clippingPlacement: ClippingPlacement | null;
  onLodBuilt?: () => void;
  onLoad?: () => void;
};

export function SparkViewer({
  url,
  activeTool,
  clippingPlacement,
  onLoad,
  onLodBuilt,
}: Props) {
  const dispatch = useAppDispatch();
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
    dispatch(setClippingPlacement(placement));
  };

  return (
    <SparkRenderer args={[sparkRendererArgs]}>
      <SplatMesh ref={meshRef} args={[splatMeshArgs]} renderOrder={SortOrder.SplatMesh}>
        {activeTool === "clipping" && !clippingPlacement && (
          <ClippingPreview
            type="cylinder"
            targetRef={meshRef}
            radius={0.5}
            height={2}
            onPlace={handlePlace}
          />
        )}

        {activeTool === "clipping" && clippingPlacement?.type === "cylinder" && (
          <CylinderClipping
            radius={clippingPlacement.radius}
            height={clippingPlacement.height}
            position={clippingPlacement.position}
            quaternion={clippingPlacement.quaternion}
            onRadiusChange={(radius) =>
              dispatch(
                updateCylinderClippingDimensions({
                  radius,
                  height: clippingPlacement.height,
                }),
              )
            }
            onHeightChange={(height) =>
              dispatch(
                updateCylinderClippingDimensions({
                  radius: clippingPlacement.radius,
                  height,
                }),
              )
            }
          />
        )}
      </SplatMesh>
    </SparkRenderer>
  );
}
