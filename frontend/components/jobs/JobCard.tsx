"use client";

import Link from "next/link";
import { Card, Space, Tag, Typography } from "antd";

import type { JobSummary } from "@/lib/types/jobs";
import { JobFilesInline } from "./JobFilesInline";

export function JobCard({ job }: { job: JobSummary }) {
  return (
    <Card style={{ width: "100%" }}>
      <Space orientation="vertical" size={8} style={{ width: "100%" }}>
        <Link href={`/jobs/${job.job_id}`} style={{ textDecoration: "underline" }}>
          <Typography.Text strong style={{ textDecoration: "underline" }}>
            Open details: {job.job_id}
          </Typography.Text>
        </Link>

        <Tag>{job.status}</Tag>

        <Typography.Text type="secondary">
          Progress: {job.progress_percent}%
        </Typography.Text>
        <Typography.Text type="secondary">
          Updated: {new Date(job.updated_at).toLocaleString()}
        </Typography.Text>

        <JobFilesInline jobId={job.job_id} />
      </Space>
    </Card>
  );
}
