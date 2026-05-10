"use client";

import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import Link from "next/link";
import { useMemo } from "react";
import { Alert, Button, Card, Descriptions, List, Space, Spin, Tag, Typography } from "antd";

import { SparkViewer } from "@/components/spark/SparkViewer";
import { useGetJobDetailsQuery } from "@/lib/jobsApi";

function pickDefaultSogUrl(
  urls: { file_name: string; url: string }[],
): string | null {
  const sog = urls.find((x) => x.file_name.toLowerCase().endsWith(".sog"));
  return sog?.url ?? urls[0]?.url ?? null;
}

export function JobDetailsPage({ jobId }: { jobId: string }) {
  const { data, isLoading, isError, error } = useGetJobDetailsQuery(jobId);

  const defaultSplatUrl = useMemo(
    () => pickDefaultSogUrl(data?.output_files ?? []),
    [data?.output_files],
  );

  return (
    <div style={{ margin: "0 auto", maxWidth: 1280, padding: 16 }}>
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <Link href="/jobs">
          <Button type="link" style={{ paddingInline: 0 }}>
            ← Back to jobs
          </Button>
        </Link>

        <Card>
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <Typography.Title level={3} style={{ margin: 0 }}>
              Job details: {jobId}
            </Typography.Title>

            {isLoading && <Spin tip="Loading job details..." />}

            {isError && (
              <Alert
                type="error"
                showIcon
                message="Failed to load details"
                description={JSON.stringify(error)}
              />
            )}

            {data && (
              <>
                <Descriptions bordered size="small" column={1}>
                  <Descriptions.Item label="Status">
                    <Tag>{data.summary.status}</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Progress">
                    {data.summary.progress_percent}%
                  </Descriptions.Item>
                  <Descriptions.Item label="Source ref">
                    {data.source_ref || "-"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Started at">
                    {data.started_at || "-"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Finished at">
                    {data.finished_at || "-"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Default splat URL">
                    {defaultSplatUrl || "not found"}
                  </Descriptions.Item>
                </Descriptions>

                <Typography.Title level={5} style={{ margin: 0 }}>
                  Output files
                </Typography.Title>
                <List
                  size="small"
                  bordered
                  dataSource={data.output_files}
                  renderItem={(f) => (
                    <List.Item>
                      <a href={f.url} target="_blank" rel="noreferrer">
                        {f.file_name}
                      </a>
                    </List.Item>
                  )}
                />
              </>
            )}
          </Space>
        </Card>

        {defaultSplatUrl && (
          <div
            style={{
              width: "100vw",
              height: "100vh",
              marginLeft: "calc(50% - 50vw)",
              overflow: "hidden",
              background: "#000",
            }}
          >
            <Canvas camera={{ position: [0, 0, 3], fov: 60 }}>
              <color attach="background" args={["#111111"]} />
              <ambientLight intensity={0.6} />

              <SparkViewer url={defaultSplatUrl} />

              <OrbitControls makeDefault enableDamping dampingFactor={0.12} />
            </Canvas>
          </div>
        )}
      </Space>
    </div>
  );
}
