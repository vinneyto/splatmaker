"use client";

import { ArrowLeft } from "lucide-react";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import Link from "next/link";
import { useMemo, useState } from "react";

import { SparkViewer } from "@/components/spark/SparkViewer";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useGetJobDetailsQuery } from "@/lib/jobsApi";
import type { OutputFile } from "@/lib/types/jobs";

export function isTouchMobileDevice(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  const hasTouch =
    navigator.maxTouchPoints > 0 ||
    "ontouchstart" in window ||
    (window.matchMedia?.("(pointer: coarse)").matches ?? false);

  const mobileUa = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);

  return hasTouch && mobileUa;
}

function pickSplatUrl(
  files: OutputFile[],
  selectedFileName?: string,
): string | null {
  if (selectedFileName) {
    const selected = files.find((x) => x.file_name === selectedFileName);
    if (selected) {
      return selected.url;
    }
  }

  const sog = files.find((x) => x.file_name.toLowerCase().endsWith(".sog"));
  return sog?.url ?? files[0]?.url ?? null;
}

type SplatLoadingPhase = "loading" | "buildingLod" | "done";

export function LoadingIndicator({
  isJobsLoading,
  phase,
}: {
  isJobsLoading: boolean;
  phase: SplatLoadingPhase;
}) {
  let text = "";
  if (isJobsLoading) {
    text = "Loading job details...";
  } else if (phase === "loading") {
    text = "Loading splat file...";
  } else if (phase === "buildingLod") {
    text = "Building LODs...";
  } else if (phase === "done") {
    text = "Done!";
  }

  return (
    <div style={{ position: "absolute", top: 70, left: 16, zIndex: 20 }}>
      <div className="flex items-center gap-2 rounded-md bg-white/90 px-3 py-2 text-sm text-zinc-700">
        <Spinner className="h-4 w-4" />
        <span>{text}</span>
      </div>
    </div>
  );
}

export function JobDetailsPage({
  jobId,
  selectedFileName,
}: {
  jobId: string;
  selectedFileName?: string;
}) {
  const { data, isLoading, isError, error } = useGetJobDetailsQuery(jobId);
  const [splatLoadingPhase, setSplatLoadingPhase] =
    useState<SplatLoadingPhase>("loading");

  const splatUrl = useMemo(
    () => pickSplatUrl(data?.output_files ?? [], selectedFileName),
    [data?.output_files, selectedFileName],
  );

  return (
    <div
      style={{ width: "100vw", height: "100vh", margin: 0, overflow: "hidden" }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          background: "#000",
        }}
      >
        <Link
          href="/jobs"
          style={{ position: "absolute", top: 16, left: 16, zIndex: 20 }}
        >
          <Button
            variant="outline"
            size="icon"
            className="rounded-full bg-white text-zinc-900 hover:bg-zinc-100"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>

        {(isLoading || splatLoadingPhase !== "done") && (
          <LoadingIndicator
            isJobsLoading={isLoading}
            phase={splatLoadingPhase}
          />
        )}

        {isError && (
          <div
            style={{
              position: "absolute",
              top: 70,
              left: 16,
              zIndex: 20,
              maxWidth: 480,
            }}
          >
            <Alert variant="destructive">
              <AlertTitle>Failed to load details</AlertTitle>
              <AlertDescription>{JSON.stringify(error)}</AlertDescription>
            </Alert>
          </div>
        )}

        {splatUrl && (
          <Canvas
            camera={{ position: [0, 0, 3], fov: 60 }}
            gl={{ antialias: false }}
            dpr={[1, isTouchMobileDevice() ? 1 : 2]}
          >
            <color attach="background" args={["#111111"]} />
            <ambientLight intensity={0.6} />

            <SparkViewer
              url={splatUrl}
              onLoad={() => setSplatLoadingPhase("buildingLod")}
              onLodBuilt={() => setSplatLoadingPhase("done")}
            />

            <OrbitControls makeDefault enableDamping dampingFactor={0.12} />
          </Canvas>
        )}
      </div>
    </div>
  );
}
