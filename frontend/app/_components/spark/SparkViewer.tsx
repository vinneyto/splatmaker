"use client";

import { useEffect } from "react";

import { ClippingPreview } from "@/app/_components/clipping/clipping-preview";
import { CylinderClipping } from "@/app/_components/clipping/cylinder-clipping";
import { CylinderClippingSdf } from "@/app/_components/clipping/cylinder-clipping-sdf";
import { SparkRenderer } from "@/app/_components/spark/spark-renderer";
import { SplatMesh } from "@/app/_components/spark/splat-mesh";
import { useSplatLod } from "@/app/_hooks/spark/use-splat-lod";
import { RenderLayer } from "@/app/_lib/render-layers";
import { SortOrder } from "@/app/_lib/sort-order";
import type { ClippingPlacement } from "@/app/_lib/types/clipping";
import { useAppDispatch } from "@/app/_store/hooks";
import {
  applyClippingDraftPlacement,
  setClippingDraftPlacement,
  updateCylinderClippingDraftDimensions,
  type ActiveTool,
} from "@/app/_store/toolsSlice";

type Props = {
  url: string;
  activeTool: ActiveTool;
  clippingPlacement: ClippingPlacement | null;
  clippingDraftPlacement: ClippingPlacement | null;
  onLodBuilt?: () => void;
  onLoad?: () => void;
};

export function SparkViewer({
  url,
  activeTool,
  clippingPlacement,
  clippingDraftPlacement,
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
    dispatch(setClippingDraftPlacement(placement));
  };

  const activeClippingPlacement =
    activeTool === "clipping" && clippingDraftPlacement
      ? clippingDraftPlacement
      : clippingPlacement;

  return (
    <SparkRenderer args={[sparkRendererArgs]}>
      <SplatMesh
        ref={meshRef}
        args={[splatMeshArgs]}
        renderOrder={SortOrder.SplatMesh}
      >
        <CylinderClippingSdf clippingPlacement={activeClippingPlacement} />

        {activeTool === "clipping" && !clippingDraftPlacement && (
          <ClippingPreview
            type="cylinder"
            targetRef={meshRef}
            radius={0.5}
            height={2}
            onPlace={handlePlace}
          />
        )}

        {activeTool === "clipping" &&
          clippingDraftPlacement?.type === "cylinder" && (
            <CylinderClipping
              radius={clippingDraftPlacement.radius}
              height={clippingDraftPlacement.height}
              position={clippingDraftPlacement.position}
              quaternion={clippingDraftPlacement.quaternion}
              onRadiusChange={(radius) =>
                dispatch(
                  updateCylinderClippingDraftDimensions({
                    radius,
                    height: clippingDraftPlacement.height,
                  }),
                )
              }
              onHeightChange={(height) =>
                dispatch(
                  updateCylinderClippingDraftDimensions({
                    radius: clippingDraftPlacement.radius,
                    height,
                  }),
                )
              }
              onApply={() => dispatch(applyClippingDraftPlacement())}
              onCopyJson={() => {
                if (typeof window === "undefined") {
                  return;
                }

                void navigator.clipboard.writeText(
                  JSON.stringify(clippingDraftPlacement, null, 2),
                );
              }}
            />
          )}
      </SplatMesh>
    </SparkRenderer>
  );
}
