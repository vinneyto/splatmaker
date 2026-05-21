"use client";

import { Html } from "@react-three/drei";
import { useState } from "react";

import { ClippingCylinderMesh } from "@/app/_components/clipping/clipping-cylinder-mesh";

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

      <Html position={[0.3, 0.2, 0]} center transform>
        <div className="relative select-none">
          <button
            type="button"
            className="h-8 w-8 rounded-full border border-white/40 bg-black/70 text-white shadow hover:bg-black/85"
            onClick={() => setIsOpen((v) => !v)}
            title="Clipping settings"
          >
            ⚙
          </button>

          {isOpen && (
            <div className="absolute top-10 left-1/2 w-56 -translate-x-1/2 rounded-lg border border-white/20 bg-black/85 p-3 text-white">
              <label className="mb-3 block text-xs">
                Radius: {radius.toFixed(2)}m
                <input
                  type="range"
                  min={0.1}
                  max={3}
                  step={0.01}
                  value={radius}
                  onChange={(event) => onRadiusChange(Number(event.target.value))}
                  className="mt-1 w-full"
                />
              </label>

              <label className="block text-xs">
                Height: {height.toFixed(2)}m
                <input
                  type="range"
                  min={0.2}
                  max={8}
                  step={0.01}
                  value={height}
                  onChange={(event) => onHeightChange(Number(event.target.value))}
                  className="mt-1 w-full"
                />
              </label>
            </div>
          )}
        </div>
      </Html>
    </group>
  );
}
