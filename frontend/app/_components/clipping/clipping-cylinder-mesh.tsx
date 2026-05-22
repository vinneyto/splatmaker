import { useEffect, useMemo } from "react";
import { CylinderGeometry, DoubleSide } from "three";

import { SortOrder } from "@/app/_lib/sort-order";

type Props = {
  radius: number;
  height: number;
};

export function ClippingCylinderMesh({ radius, height }: Props) {
  const edgeSourceGeometry = useMemo(
    () => new CylinderGeometry(radius, radius, height, 24, 1, true),
    [radius, height],
  );

  useEffect(() => {
    return () => {
      edgeSourceGeometry.dispose();
    };
  }, [edgeSourceGeometry]);

  return (
    <group>
      <mesh renderOrder={SortOrder.ClippingOverlayFill}>
        <cylinderGeometry args={[radius, radius, height, 48, 1, true]} />
        <meshBasicMaterial
          color="#67e8f9"
          transparent
          opacity={0.2}
          depthTest={false}
          depthWrite={false}
          side={DoubleSide}
        />
      </mesh>

      <lineSegments renderOrder={SortOrder.ClippingDepthLines}>
        <edgesGeometry args={[edgeSourceGeometry]} />
        <lineBasicMaterial color="#22d3ee" depthTest depthWrite />
      </lineSegments>
    </group>
  );
}
