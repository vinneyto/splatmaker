"use client";

import { ThreeElement, extend } from "@react-three/fiber";
import {
  SplatMesh as ThreeSplatMesh,
  type SplatMeshOptions,
} from "@sparkjsdev/spark";
import { useEffect, useMemo, useRef, useState } from "react";

extend({ SplatMesh: ThreeSplatMesh });

declare module "@react-three/fiber" {
  interface ThreeElements {
    splatMesh: ThreeElement<typeof ThreeSplatMesh>;
  }
}

type Props = {
  url: string;
  onLodBuilt?: () => void;
  onLoad?: () => void;
};

export function SplatMesh({ url, onLoad, onLodBuilt }: Props) {
  const meshRef = useRef<ThreeSplatMesh | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLodBuilt, setIsLodBuilt] = useState(false);

  const meshArgs = useMemo<[SplatMeshOptions]>(
    () => [
      {
        url,
        lod: true,
        onProgress: (event: ProgressEvent<EventTarget>) => {
          if (event.loaded >= event.total) {
            setIsLoaded(true);
          }
        },
      },
    ],
    [url],
  );

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

  useEffect(() => {
    return () => {
      meshRef.current?.dispose();
      meshRef.current = null;
    };
  }, [url]);

  useEffect(() => {
    if (isLoaded && !isLodBuilt) {
      onLoad?.();
    }

    if (isLoaded && isLodBuilt) {
      onLodBuilt?.();
    }
  }, [isLoaded, isLodBuilt, onLoad, onLodBuilt]);

  return (
    <splatMesh
      key={url}
      ref={(mesh) => {
        meshRef.current = mesh as ThreeSplatMesh | null;
      }}
      args={meshArgs}
    />
  );
}
