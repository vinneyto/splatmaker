"use client";

import { JobCard } from "@/components/jobs/JobCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { useListJobsQuery } from "@/lib/jobsApi";

export function JobsListPage() {
  const { data, isLoading, isError, error } = useListJobsQuery({ limit: 100 });

  return (
    <div className="flex w-full justify-center">
      <div className="w-full max-w-[1000px] p-4">
        <div className="flex w-full flex-col gap-5">
          <h1 className="m-0 text-2xl font-semibold tracking-tight">Jobs</h1>

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
