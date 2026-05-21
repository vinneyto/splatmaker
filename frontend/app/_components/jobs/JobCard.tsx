"use client";

import Link from "next/link";

import { JobFilesInline } from "@/app/_components/jobs/JobFilesInline";
import { Badge } from "@/app/_components/ui/badge";
import { Card, CardContent } from "@/app/_components/ui/card";
import type { JobSummary } from "@/app/_lib/types/jobs";

export function JobCard({ job }: { job: JobSummary }) {
  const base = process.env.FRONTEND_API_PROXY_BASE_URL;
  const thumbnailUrl = `${base ?? ""}/media/workflow-output/${job.job_id}/render_thumbnail.png`;
  const isCompleted = job.progress_percent >= 100;

  return (
    <Card className="w-full rounded-xl border-zinc-200/70 shadow-sm">
      <CardContent className="flex w-full items-start justify-between gap-4 p-4">
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          {isCompleted ? (
            <Link
              href={`/jobs/${job.job_id}`}
              className="inline-flex w-fit items-center font-semibold text-zinc-900 underline underline-offset-2"
            >
              Open details: {job.job_id}
            </Link>
          ) : (
            <span className="inline-flex w-fit items-center font-semibold text-zinc-900">
              Open details: {job.job_id}
            </span>
          )}

          <Badge className="w-fit">{job.status}</Badge>

          <p className="text-sm text-zinc-600">
            Progress: {job.progress_percent}%
          </p>
          <p className="text-sm text-zinc-600">
            Updated: {new Date(job.updated_at).toLocaleString()}
          </p>

          <JobFilesInline jobId={job.job_id} />
        </div>

        {isCompleted ? (
          <Link href={`/jobs/${job.job_id}`} className="shrink-0">
            <img
              src={thumbnailUrl}
              alt={`Thumbnail for job ${job.job_id}`}
              className="h-24 w-40 rounded-md border border-zinc-200 object-cover"
            />
          </Link>
        ) : (
          <div className="flex h-24 w-40 shrink-0 items-center justify-center rounded-md border border-dashed border-zinc-300 bg-zinc-100 text-xs font-medium text-zinc-500">
            Preview pending
          </div>
        )}
      </CardContent>
    </Card>
  );
}
