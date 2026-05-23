"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { JobCard } from "@/app/_components/jobs/JobCard";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/app/_components/ui/alert";
import { Spinner } from "@/app/_components/ui/spinner";
import { useListJobsQuery } from "@/app/_lib/jobsApi";
import { setPendingSplatFile } from "@/app/_lib/localSplatTransfer";

const SPLAT_EXTENSIONS = [".ply", ".spz", ".sog"];

function isSupportedSplatFile(name: string) {
  const lower = name.toLowerCase();
  return SPLAT_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

export function JobsListPage() {
  const { data, isLoading, isError, error } = useListJobsQuery({ limit: 100 });
  const router = useRouter();
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [dropError, setDropError] = useState<string | null>(null);

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDraggingFile(false);
    setDropError(null);

    const file = event.dataTransfer.files?.[0];
    if (!file) {
      setDropError("No file received from drop.");
      return;
    }

    if (!isSupportedSplatFile(file.name)) {
      setDropError("Unsupported file type. Drop .ply, .spz, or .sog file.");
      return;
    }

    setPendingSplatFile(file);
    router.push("/viewer/local");
  };

  return (
    <div
      className="flex w-full justify-center"
      onDragOver={(event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "copy";
        setIsDraggingFile(true);
      }}
      onDragLeave={() => setIsDraggingFile(false)}
      onDrop={handleDrop}
    >
      <div className="w-full max-w-[1000px] p-4">
        <div className="flex w-full flex-col gap-5">
          <h1 className="m-0 text-2xl font-semibold tracking-tight">Jobs</h1>

          {isDraggingFile && (
            <div className="rounded-xl border-2 border-dashed border-blue-500 bg-blue-50 px-4 py-3 text-sm text-blue-700">
              Drop .ply/.spz/.sog file to open it in local viewer page.
            </div>
          )}

          {dropError && (
            <Alert variant="destructive">
              <AlertTitle>Drop failed</AlertTitle>
              <AlertDescription>{dropError}</AlertDescription>
            </Alert>
          )}

          {isLoading && (
            <div className="flex items-center gap-2 text-zinc-600">
              <Spinner />
              <span>Loading jobs...</span>
            </div>
          )}

          {isError && (
            <Alert variant="destructive">
              <AlertTitle>Failed to load jobs</AlertTitle>
              <AlertDescription>{JSON.stringify(error)}</AlertDescription>
            </Alert>
          )}

          {!isLoading && !isError && (data?.items.length ?? 0) === 0 && (
            <Alert>
              <AlertTitle>No jobs found</AlertTitle>
            </Alert>
          )}

          {!isError && (
            <div className="flex w-full flex-col gap-4">
              {(data?.items ?? []).map((job) => (
                <div key={job.job_id} className="w-full">
                  <JobCard job={job} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
