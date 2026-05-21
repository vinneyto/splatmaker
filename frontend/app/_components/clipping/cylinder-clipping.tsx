"use client";

import { Html } from "@react-three/drei";
import { useState } from "react";

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
};

export function CylinderClipping({
  radius,
  height,
  position,
  quaternion,
  onRadiusChange,
  onHeightChange,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <group position={position} quaternion={quaternion}>
      <ClippingCylinderMesh radius={radius} height={height} />

      <Html position={[0.3, 0.2, 0]} center>
        <div className="relative select-none">
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/40 bg-black/70 text-white shadow hover:bg-black/85"
            onClick={() => setIsOpen((v) => !v)}
            title="Clipping settings"
          >
            <ClippingSettingsIcon className="h-4 w-4" />
          </button>

          {isOpen && (
            <div className="absolute top-10 left-1/2 -translate-x-1/2">
              <CylinderClippingSettings
                radius={radius}
                height={height}
                onRadiusChange={onRadiusChange}
                onHeightChange={onHeightChange}
              />
            </div>
          )}
        </div>
      </Html>
    </group>
  );
}
