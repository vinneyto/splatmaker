"use client";

import { OrbitControls } from "@react-three/drei";

export function OrbitCameraControls() {
  return <OrbitControls makeDefault enableDamping dampingFactor={0.12} />;
}
