"use client";

import { Link } from "react-router-dom";
import { useMemo, useState } from "react";

import { JobDetailsBackButton } from "@/components/jobs/job-details/JobDetailsBackButton";
import { JobDetailsCanvas } from "@/components/jobs/job-details/JobDetailsCanvas";
import { JobDetailsErrorAlert } from "@/components/jobs/job-details/JobDetailsErrorAlert";
import { JobDetailsLoadingBadge } from "@/components/jobs/job-details/JobDetailsLoadingBadge";
import { pickSplatUrl } from "@/components/jobs/job-details/utils";
import { useGetJobDetailsQuery } from "@/lib/jobsApi";

type Props = {
  jobId: string;
  selectedFileName?: string;
};

type SplatLoadingPhase = "loading" | "buildingLod" | "done";

export function JobDetailsPage({ jobId, selectedFileName }: Props) {
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
          to="/jobs"
          style={{ position: "absolute", top: 16, left: 16, zIndex: 20 }}
        >
          <JobDetailsBackButton />
        </Link>

        {(isLoading || splatLoadingPhase !== "done") && (
          <JobDetailsLoadingBadge
            isJobsLoading={isLoading}
            phase={splatLoadingPhase}
          />
        )}

        {isError && <JobDetailsErrorAlert error={error} />}

        {splatUrl && (
          <JobDetailsCanvas
            url={splatUrl}
            onLoad={() => setSplatLoadingPhase("buildingLod")}
            onLodBuilt={() => setSplatLoadingPhase("done")}
          />
        )}
      </div>
    </div>
  );
}
