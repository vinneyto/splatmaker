"use client";

import Link from "next/link";
import { useState } from "react";
import { Alert, Collapse, Space, Spin } from "antd";

import { useGetJobDetailsQuery } from "@/lib/jobsApi";

export function JobFilesInline({ jobId }: { jobId: string }) {
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
