import { SplatMesh } from "@sparkjsdev/spark";

export function createSplatMeshNode(url: string): SplatMesh {
  return new SplatMesh({
    url,
  });
}
