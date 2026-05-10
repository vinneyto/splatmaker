"use client";

import Link from "next/link";
import { Alert, Card, Space, Spin, Table, Tag, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";

import { useListJobsQuery } from "@/lib/jobsApi";
import type { JobSummary } from "@/lib/types/jobs";

const columns: ColumnsType<JobSummary> = [
  {
    title: "Job ID",
    dataIndex: "job_id",
    key: "job_id",
    render: (jobId: string) => <Link href={`/jobs/${jobId}`}>{jobId}</Link>,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status: string) => <Tag>{status}</Tag>,
  },
  {
    title: "Progress",
    dataIndex: "progress_percent",
    key: "progress_percent",
    render: (progress: number) => `${progress}%`,
  },
  {
    title: "Updated",
    dataIndex: "updated_at",
    key: "updated_at",
    render: (value: string) => new Date(value).toLocaleString(),
  },
];

export function JobsListPage() {
  const { data, isLoading, isError, error } = useListJobsQuery({ limit: 100 });

  return (
    <div style={{ margin: "0 auto", maxWidth: 1100, padding: 16 }}>
      <Card>
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <Typography.Title level={3} style={{ margin: 0 }}>
            Jobs
          </Typography.Title>

          {isLoading && <Spin tip="Loading jobs..." />}

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
            <Table<JobSummary>
              rowKey="job_id"
              dataSource={data?.items ?? []}
              columns={columns}
              pagination={false}
            />
          )}
        </Space>
      </Card>
    </div>
  );
}
