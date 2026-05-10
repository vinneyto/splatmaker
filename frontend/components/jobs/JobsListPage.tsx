"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  List,
  Row,
  Space,
  Spin,
  Tag,
  Typography,
} from "antd";

import { useGetJobDetailsQuery, useListJobsQuery } from "@/lib/jobsApi";
import type { JobSummary } from "@/lib/types/jobs";

function JobFilesInline({ jobId }: { jobId: string }) {
  const [expanded, setExpanded] = useState(false);
  const { data, isFetching, isError, error } = useGetJobDetailsQuery(jobId, {
    skip: !expanded,
  });

  return (
    <Space direction="vertical" size={8} style={{ width: "100%" }}>
      <Button size="small" onClick={() => setExpanded((prev) => !prev)}>
        {expanded ? "Hide files" : "Show files"}
      </Button>

      {expanded && isFetching && <Spin size="small" tip="Loading files..." />}

      {expanded && isError && (
        <Alert
          type="error"
          showIcon
          message="Failed to load files"
          description={JSON.stringify(error)}
        />
      )}

      {expanded && data && (
        <List
          size="small"
          bordered
          dataSource={data.output_files}
          locale={{ emptyText: "No files" }}
          renderItem={(file) => (
            <List.Item>
              <Link
                href={`/jobs/${jobId}?fileKey=${encodeURIComponent(file.key)}`}
              >
                {file.file_name}
              </Link>
            </List.Item>
          )}
        />
      )}
    </Space>
  );
}

function JobCard({ job }: { job: JobSummary }) {
  return (
    <Card hoverable>
      <Space direction="vertical" size={8} style={{ width: "100%" }}>
        <Link href={`/jobs/${job.job_id}`}>
          <Typography.Text strong>{job.job_id}</Typography.Text>
        </Link>

        <div>
          <Tag>{job.status}</Tag>
        </div>

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
    <div style={{ margin: "0 auto", maxWidth: 1100, padding: 16 }}>
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
          <Row gutter={[16, 16]}>
            {(data?.items ?? []).map((job) => (
              <Col xs={24} md={12} lg={8} key={job.job_id}>
                <JobCard job={job} />
              </Col>
            ))}
          </Row>
        )}
      </Space>
    </div>
  );
}
