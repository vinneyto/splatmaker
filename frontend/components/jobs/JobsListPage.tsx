"use client";

import Link from "next/link";
import { Alert, Card, Col, Row, Space, Spin, Tag, Typography } from "antd";

import { useListJobsQuery } from "@/lib/jobsApi";

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
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Space>
    </div>
  );
}
