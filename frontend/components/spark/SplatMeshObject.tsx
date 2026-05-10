"use client";

import { SplatMesh } from "@sparkjsdev/spark";
import { useEffect, useMemo } from "react";

type Props = {
  url: string;
};

export function SplatMeshObject({ url }: Props) {
  const mesh = useMemo(
    () =>
      new SplatMesh({
        url,
      }),
    [url],
  );

  useEffect(() => {
    return () => {
      mesh.dispose();
    };
  }, [mesh]);

  return <primitive object={mesh} />;
}
