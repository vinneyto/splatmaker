import { SparkRenderer } from "@sparkjsdev/spark";
import type { WebGLRenderer } from "three";

export function createSparkRendererNode(renderer: WebGLRenderer): SparkRenderer {
  return new SparkRenderer({
    renderer,
    autoUpdate: true,
  });
}
