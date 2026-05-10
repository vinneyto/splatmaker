"use client";

import Link from "next/link";
import { useState } from "react";
import { Alert, Card, Collapse, Space, Spin, Tag, Typography } from "antd";

import { useGetJobDetailsQuery, useListJobsQuery } from "@/lib/jobsApi";
import type { JobSummary } from "@/lib/types/jobs";

function JobFilesInline({ jobId }: { jobId: string }) {
  const [expanded, setExpanded] = useState(false);
  const { data, isFetching, isError, error } = useGetJobDetailsQuery(jobId, {
    skip: !expanded,
  });

  return (
    <Collapse
      size="small"
      ghost
      onChange={(keys) => setExpanded(Array.isArray(keys) ? keys.length > 0 : !!keys)}
      items={[
        {
          key: "files",
          label: "Files",
          children: (
            <Space orientation="vertical" size={8} style={{ width: "100%" }}>
              {isFetching && <Spin size="small" description="Loading files..." />}

              {isError && (
                <Alert
                  type="error"
                  showIcon
                  message="Failed to load files"
                  description={JSON.stringify(error)}
                />
              )}

              {!isFetching && !isError && (
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {(data?.output_files ?? []).map((file) => (
                    <li key={file.key}>
                      <Link
                        href={`/jobs/${jobId}?fileName=${encodeURIComponent(file.file_name)}`}
                      >
                        {file.file_name}
                      </Link>
                    </li>
                  ))}
                  {(data?.output_files.length ?? 0) === 0 && <li>No files</li>}
                </ul>
              )}
            </Space>
          ),
        },
      ]}
    />
  );
}

function JobCard({ job }: { job: JobSummary }) {
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

export function JobsListPage() {
  const { data, isLoading, isError, error } = useListJobsQuery({ limit: 100 });

  return (
    <div style={{ margin: "0 auto", maxWidth: 1000, padding: 16 }}>
      <Space orientation="vertical" size="middle" style={{ width: "100%" }}>
        <Typography.Title level={3} style={{ margin: 0 }}>
          Jobs
        </Typography.Title>

        {isLoading && <Spin description="Loading jobs..." />}

        {isError && (
          <Alert
            type="error"
            showIcon
            message="Failed to load jobs"
            description={JSON.stringify(error)}
          />
        )}

        {!isLoading && !isError && (data?.items.length ?? 0) === 0 && (
          <Alert type="info" showIcon message="No jobs found" />
        )}

        {!isError && (
          <Space orientation="vertical" size="middle" style={{ width: "100%" }}>
            {(data?.items ?? []).map((job) => (
              <div key={job.job_id} style={{ width: "100%" }}>
                <JobCard job={job} />
              </div>
            ))}
          </Space>
        )}
      </Space>
    </div>
  );
}
