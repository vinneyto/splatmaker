"use client";

import { SplatMesh as ThreeSplatMesh } from "@sparkjsdev/spark";
import { useEffect, useMemo, useState } from "react";

type Props = {
  url: string;
  onLoad?: () => void;
};

export function SplatMesh({ url, onLoad }: Props) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLodBuilt, setIsLodBuilt] = useState(false);

  useEffect(() => {
    if (isLoaded && isLodBuilt && onLoad) {
      onLoad();
    }
  }, [isLoaded, isLodBuilt, onLoad]);

  const mesh = useMemo(
    () =>
      new ThreeSplatMesh({
        url,
        lod: true,
        onProgress: (event) => {
          if (event.loaded >= event.total) {
            setIsLoaded(true);
          }
        },
      }),
    [url],
  );

  useEffect(() => {
    const handleLodBuilt = () => {
      setIsLodBuilt(true);
    };

    if (!isLoaded) {
      return;
    }

    const interval = setInterval(() => {
      if (mesh.packedSplats?.lodSplats) {
        handleLodBuilt();
        clearInterval(interval);
      }
    }, 100);

    return () => {
      clearInterval(interval);
    };
  }, [mesh, isLoaded]);

  useEffect(() => {
    return () => {
      mesh.dispose();
    };
  }, [mesh]);

  return <primitive object={mesh} />;
}
