"use client";

import { useSearchParams } from "next/navigation";

import { JobDetailsPage } from "@/components/jobs/JobDetailsPage";
import { JobsListPage } from "@/components/jobs/JobsListPage";

export function JobsRouteClient() {
  const searchParams = useSearchParams();
  const jobId = searchParams.get("jobId") ?? undefined;
  const fileName = searchParams.get("fileName") ?? undefined;

  if (jobId) {
    return <JobDetailsPage jobId={jobId} selectedFileName={fileName} />;
  }

  return <JobsListPage />;
}
