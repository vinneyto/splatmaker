"use client";

import { Alert, Space, Spin, Typography } from "antd";

import { useListJobsQuery } from "@/lib/jobsApi";
import { JobCard } from "./JobCard";

export function JobsListPage() {
  const { data, isLoading, isError, error } = useListJobsQuery({ limit: 100 });

  return (
    <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
      <div style={{ width: "100%", maxWidth: 1000, padding: 16 }}>
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
    </div>
  );
}
