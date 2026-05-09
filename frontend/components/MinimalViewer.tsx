"use client";

import { Canvas } from "@react-three/fiber";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { usePublicSplatUrl } from "@/hooks/usePublicSplatUrl";
import { OrbitCameraControls } from "@/three-react/camera/OrbitCameraControls";
import { SparkRendererObject } from "@/three-react/components/SparkRendererObject";
import { SplatMeshObject } from "@/three-react/components/SplatMeshObject";

const DEFAULT_FILE = "sample.sog";

export function MinimalViewer() {
  const [filenameInput, setFilenameInput] = useState(DEFAULT_FILE);
  const [activeFilename, setActiveFilename] = useState(DEFAULT_FILE);

  const splatUrl = usePublicSplatUrl(activeFilename);
  const key = useMemo(() => `${splatUrl}:${activeFilename}`, [splatUrl, activeFilename]);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Local Splat Viewer (Spark + R3F)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Put your file into <code>frontend/public/</code>, then enter filename (example:
            <code> sample.sog</code> or <code>sample.ply</code>).
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              value={filenameInput}
              onChange={(e) => setFilenameInput(e.target.value)}
              placeholder="sample.sog"
            />
            <Button onClick={() => setActiveFilename(filenameInput.trim() || DEFAULT_FILE)}>
              Load
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">Current URL: {splatUrl}</p>
        </CardContent>
      </Card>

      <div className="h-[70vh] w-full overflow-hidden rounded-xl border bg-black">
        <Canvas camera={{ position: [0, 0, 3], fov: 60 }}>
          <color attach="background" args={["#111111"]} />
          <ambientLight intensity={0.6} />

          <SparkRendererObject />
          <SplatMeshObject key={key} url={splatUrl} />

          <OrbitCameraControls />
        </Canvas>
      </div>
    </div>
  );
}
