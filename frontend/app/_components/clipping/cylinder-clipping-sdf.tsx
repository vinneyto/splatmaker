"use client";

import { Color } from "three";
import {
  SplatEditRgbaBlendMode,
  SplatEditSdfType,
} from "@sparkjsdev/spark";

import { SplatEdit } from "@/app/_components/spark/splat-edit";
import { SplatEditSdf } from "@/app/_components/spark/splat-edit-sdf";
import type { ClippingPlacement } from "@/app/_lib/types/clipping";

const WHITE = new Color(1, 1, 1);

type Props = {
  clippingPlacement: ClippingPlacement | null;
};

export function CylinderClippingSdf({ clippingPlacement }: Props) {
  if (!clippingPlacement || clippingPlacement.type !== "cylinder") {
    return null;
  }

  return (
    <SplatEdit
      args={[
        {
          name: "Cylinder clipping",
          rgbaBlendMode: SplatEditRgbaBlendMode.MULTIPLY,
          invert: true,
          softEdge: 0,
          sdfSmooth: 0,
        },
      ]}
    >
      <SplatEditSdf
        args={[
          {
            type: SplatEditSdfType.CYLINDER,
            opacity: 0,
            color: WHITE,
          },
        ]}
        position={clippingPlacement.position}
        quaternion={clippingPlacement.quaternion}
        scale={[1, clippingPlacement.height * 0.5, 1]}
        radius={clippingPlacement.radius}
      />
    </SplatEdit>
  );
}
