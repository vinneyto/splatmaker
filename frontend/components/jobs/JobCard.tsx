"use client";

import Link from "next/link";

import { JobFilesInline } from "@/components/jobs/JobFilesInline";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { JobSummary } from "@/lib/types/jobs";

export function JobCard({ job }: { job: JobSummary }) {
  return (
    <Card className="w-full">
      <CardContent className="flex w-full flex-col gap-2">
        <Link href={`/jobs/${job.job_id}`} className="font-semibold underline underline-offset-2">
          Open details: {job.job_id}
        </Link>

        <Badge className="w-fit">{job.status}</Badge>

        <p className="text-sm text-zinc-600">Progress: {job.progress_percent}%</p>
        <p className="text-sm text-zinc-600">Updated: {new Date(job.updated_at).toLocaleString()}</p>

        <JobFilesInline jobId={job.job_id} />
      </CardContent>
    </Card>
  );
}
