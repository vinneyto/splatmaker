"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { JobDetailsBackButton } from "@/app/_components/jobs/job-details/JobDetailsBackButton";
import { JobDetailsCanvas } from "@/app/_components/jobs/job-details/JobDetailsCanvas";
import { JobDetailsLoadingBadge } from "@/app/_components/jobs/job-details/JobDetailsLoadingBadge";
import { takePendingSplatFile } from "@/app/_lib/localSplatTransfer";

type SplatLoadingPhase = "loading" | "buildingLod" | "done";

export function LocalSplatViewerPage() {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [splatLoadingPhase, setSplatLoadingPhase] =
    useState<SplatLoadingPhase>("loading");

  useEffect(() => {
    const file = takePendingSplatFile();
    if (!file) {
      setLoadError("No dropped file found. Go back to Jobs and drop a file there.");
      return;
    }

    const nextBlobUrl = URL.createObjectURL(file);
    setBlobUrl(nextBlobUrl);
    setFileName(file.name);

    return () => {
      URL.revokeObjectURL(nextBlobUrl);
    };
  }, []);

  const title = useMemo(() => {
    if (!fileName) return "Local splat viewer";
    return `Local splat viewer: ${fileName}`;
  }, [fileName]);

  return (
    <div style={{ width: "100vw", height: "100vh", margin: 0, overflow: "hidden" }}>
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          background: "#000",
        }}
      >
        <Link href="/jobs" style={{ position: "absolute", top: 16, left: 16, zIndex: 20 }}>
          <JobDetailsBackButton />
        </Link>

        <div
          style={{
            position: "absolute",
            top: 18,
            left: 76,
            right: 16,
            zIndex: 20,
            color: "#fff",
            fontSize: 14,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {title}
        </div>

        {(blobUrl && splatLoadingPhase !== "done") && (
          <JobDetailsLoadingBadge
            isJobsLoading={false}
            phase={splatLoadingPhase}
          />
        )}

        {loadError && (
          <div
            style={{
              position: "absolute",
              top: 80,
              left: 16,
              right: 16,
              zIndex: 20,
              borderRadius: 8,
              border: "1px solid rgba(239,68,68,0.5)",
              background: "rgba(127,29,29,0.35)",
              color: "#fecaca",
              padding: "12px 14px",
            }}
          >
            {loadError}
          </div>
        )}

        {blobUrl && (
          <JobDetailsCanvas
            url={blobUrl}
            onLoad={() => setSplatLoadingPhase("buildingLod")}
            onLodBuilt={() => setSplatLoadingPhase("done")}
          />
        )}
      </div>
    </div>
  );
}
