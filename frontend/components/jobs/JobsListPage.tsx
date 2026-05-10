"use client";

import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useListJobsQuery } from "@/lib/jobsApi";

export function JobsListPage() {
  const { data, isLoading, isError, error } = useListJobsQuery({ limit: 100 });

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Jobs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {isLoading && <p className="text-sm text-muted-foreground">Loading jobs…</p>}

          {isError && (
            <p className="text-sm text-red-500">
              Failed to load jobs: {JSON.stringify(error)}
            </p>
          )}

          {!isLoading && !isError && (data?.items.length ?? 0) === 0 && (
            <p className="text-sm text-muted-foreground">No jobs found.</p>
          )}

          <ul className="space-y-2">
            {data?.items.map((job) => (
              <li key={job.job_id} className="rounded-md border p-3">
                <Link href={`/jobs/${job.job_id}`} className="font-medium underline">
                  {job.job_id}
                </Link>
                <div className="mt-1 text-xs text-muted-foreground">
                  status: {job.status} · progress: {job.progress_percent}% · updated: {new Date(job.updated_at).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
