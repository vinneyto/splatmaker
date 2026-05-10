"use client";

import { SplatMesh as ThreeSplatMesh } from "@sparkjsdev/spark";
import { useEffect, useMemo } from "react";

type Props = {
  url: string;
};

export function SplatMesh({ url }: Props) {
  const mesh = useMemo(
    () =>
      new ThreeSplatMesh({
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
