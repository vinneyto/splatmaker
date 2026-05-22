"use client";

import { Html } from "@react-three/drei";
import { type PointerEvent, useCallback, useState } from "react";

import { ClippingCylinderMesh } from "@/app/_components/clipping/clipping-cylinder-mesh";
import { ClippingSettingsIcon } from "@/app/_components/clipping/clipping-settings-icon";
import { CylinderClippingSettings } from "@/app/_components/clipping/cylinder-clipping-settings";

type Props = {
  radius: number;
  height: number;
  position: [number, number, number];
  quaternion: [number, number, number, number];
  onRadiusChange: (radius: number) => void;
  onHeightChange: (height: number) => void;
  onApply: () => void;
  onCopyJson: () => void;
};

export function CylinderClipping({
  radius,
  height,
  position,
  quaternion,
  onRadiusChange,
  onHeightChange,
  onApply,
  onCopyJson,
}: Props) {
  const [isOpen, setIsOpen] = useState(true);

  const stopPointerPropagation = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      event.stopPropagation();
    },
    [],
  );

  return (
    <group position={position} quaternion={quaternion}>
      <ClippingCylinderMesh radius={radius} height={height} />

      <Html position={[0, 0, 0]} center>
        <div
          className="relative flex select-none items-center"
          onPointerDown={stopPointerPropagation}
          onPointerMove={stopPointerPropagation}
          onPointerUp={stopPointerPropagation}
        >
          <button
            type="button"
            className="flex h-7 w-7 items-center justify-center rounded-full border border-white/40 bg-black/70 text-white shadow hover:bg-black/85"
            onClick={() => setIsOpen((v) => !v)}
            title={isOpen ? "Close clipping settings" : "Clipping settings"}
          >
            {isOpen ? (
              <span className="text-base leading-none">×</span>
            ) : (
              <ClippingSettingsIcon className="h-3.5 w-3.5" />
            )}
          </button>

          {isOpen && (
            <div className="absolute left-full top-1/2 ml-2 -translate-y-1/2">
              <CylinderClippingSettings
                radius={radius}
                height={height}
                onRadiusChange={onRadiusChange}
                onHeightChange={onHeightChange}
                onApply={onApply}
                onCopyJson={onCopyJson}
              />
            </div>
          )}
        </div>
      </Html>
    </group>
  );
}
