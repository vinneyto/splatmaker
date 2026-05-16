"use client";

import { JobDetailsPage } from "@/components/jobs/JobDetailsPage";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function JobDetailsByQueryContent() {
  const searchParams = useSearchParams();
  const jobId = searchParams.get("jobId") ?? undefined;
  const fileName = searchParams.get("fileName") ?? undefined;

  if (!jobId) {
    return <div className="p-6 text-sm text-zinc-600">Missing required query parameter: jobId</div>;
  }

  return <JobDetailsPage jobId={jobId} selectedFileName={fileName} />;
}

export default function JobDetailsByQueryPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-zinc-600">Loading...</div>}>
      <JobDetailsByQueryContent />
    </Suspense>
  );
}
