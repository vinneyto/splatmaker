"use client";

import { useThree } from "@react-three/fiber";
import type { SplatMesh as SparkSplatMesh } from "@sparkjsdev/spark";
import { type RefObject, useEffect, useMemo, useRef, useState } from "react";
import { Quaternion, Raycaster, Vector2, Vector3 } from "three";

import { ClippingCylinderMesh } from "@/app/_components/clipping/clipping-cylinder-mesh";

export type ClippingType = "cylinder";

export type ClippingPlacement = {
  type: ClippingType;
  radius: number;
  height: number;
  position: [number, number, number];
  quaternion: [number, number, number, number];
};

type Props = {
  type: ClippingType;
  targetRef: RefObject<SparkSplatMesh | null>;
  radius?: number;
  height?: number;
  onPlace: (placement: ClippingPlacement) => void;
};

export function ClippingPreview({
  type,
  targetRef,
  radius = 0.5,
  height = 2,
  onPlace,
}: Props) {
  const camera = useThree((state) => state.camera);
  const gl = useThree((state) => state.gl);
  const raycaster = useMemo(() => new Raycaster(), []);
  const pointer = useMemo(() => new Vector2(), []);

  const [position, setPosition] = useState<Vector3 | null>(null);
  const [isPlaced, setIsPlaced] = useState(false);

  const positionRef = useRef<Vector3 | null>(null);
  const isPlacedRef = useRef(false);

  useEffect(() => {
    positionRef.current = position;
  }, [position]);

  useEffect(() => {
    isPlacedRef.current = isPlaced;
  }, [isPlaced]);

  useEffect(() => {
    const dom = gl.domElement;

    const updatePosition = (event: PointerEvent) => {
      if (isPlacedRef.current) {
        return;
      }

      const rect = dom.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      const target = targetRef.current;
      if (!target) {
        return;
      }

      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObject(target, true);
      if (hits[0]?.point) {
        setPosition(hits[0].point.clone());
      }
    };

    const place = () => {
      if (isPlacedRef.current || !positionRef.current) {
        return;
      }

      const quaternion = new Quaternion();
      const currentPosition = positionRef.current;
      const payload: ClippingPlacement = {
        type,
        radius,
        height,
        position: [currentPosition.x, currentPosition.y, currentPosition.z],
        quaternion: [quaternion.x, quaternion.y, quaternion.z, quaternion.w],
      };

      setIsPlaced(true);
      onPlace(payload);
    };

    dom.addEventListener("pointermove", updatePosition);
    dom.addEventListener("pointerdown", place);

    return () => {
      dom.removeEventListener("pointermove", updatePosition);
      dom.removeEventListener("pointerdown", place);
    };
  }, [camera, gl, height, onPlace, pointer, radius, raycaster, targetRef, type]);

  if (!position) {
    return null;
  }

  return (
    <group position={position}>
      <ClippingCylinderMesh radius={radius} height={height} />
    </group>
  );
}
