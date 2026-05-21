"use client";

import { SparkRenderer } from "@/app/_components/spark/spark-renderer";
import { SplatMesh } from "@/app/_components/spark/splat-mesh";
import { useThree } from "@react-three/fiber";
import type { SplatMesh as SparkSplatMesh } from "@sparkjsdev/spark";
import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  url: string;
  onLodBuilt?: () => void;
  onLoad?: () => void;
};

export function SparkViewer({ url, onLoad, onLodBuilt }: Props) {
  const renderer = useThree((state) => state.gl);
  const meshRef = useRef<SparkSplatMesh>(null);

  const [isLoaded, setIsLoaded] = useState(false);
  const [isLodBuilt, setIsLodBuilt] = useState(false);

  useEffect(() => {
    if (isLoaded && !isLodBuilt && onLoad) {
      onLoad();
    }

    if (isLoaded && isLodBuilt && onLodBuilt) {
      onLodBuilt();
    }
  }, [isLoaded, isLodBuilt, onLoad, onLodBuilt]);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    const interval = setInterval(() => {
      if (meshRef.current?.packedSplats?.lodSplats) {
        setIsLodBuilt(true);
        clearInterval(interval);
      }
    }, 100);

    return () => {
      clearInterval(interval);
    };
  }, [isLoaded]);

  const sparkRendererArgs = useMemo(() => {
    return {
      renderer,
      autoUpdate: true,
      enableLod: true,
    };
  }, [renderer]);

  const splatMeshArgs = useMemo(
    () => ({
      url,
      lod: true,
      onProgress: (event: ProgressEvent<EventTarget>) => {
        if (event.loaded >= event.total) {
          setIsLoaded(true);
        }
      },
    }),
    [url],
  );

  return (
    <SparkRenderer args={[sparkRendererArgs]}>
      <SplatMesh ref={meshRef} args={[splatMeshArgs]} />
    </SparkRenderer>
  );
}
