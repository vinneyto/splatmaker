"use client";

import { JobDetailsPage } from "@/components/jobs/JobDetailsPage";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function JobDetailsByQueryContent() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const pathJobId = pathname?.startsWith("/jobs/") ? pathname.slice("/jobs/".length).split("/")[0] : undefined;
  const jobId = searchParams.get("jobId") ?? pathJobId ?? undefined;
  const fileName = searchParams.get("fileName") ?? undefined;

  if (!jobId) {
    return <div className="p-6 text-sm text-zinc-600">Missing required job id in URL</div>;
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
