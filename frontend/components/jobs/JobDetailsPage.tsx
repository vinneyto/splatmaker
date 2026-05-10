"use client";

import { ArrowLeftOutlined } from "@ant-design/icons";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import Link from "next/link";
import { useMemo } from "react";
import { Alert, Button, Spin } from "antd";

import { SparkViewer } from "@/components/spark/SparkViewer";
import { useGetJobDetailsQuery } from "@/lib/jobsApi";
import type { OutputFile } from "@/lib/types/jobs";

function pickSplatUrl(files: OutputFile[], selectedFileName?: string): string | null {
  if (selectedFileName) {
    const selected = files.find((x) => x.file_name === selectedFileName);
    if (selected) {
      return selected.url;
    }
  }

  const sog = files.find((x) => x.file_name.toLowerCase().endsWith(".sog"));
  return sog?.url ?? files[0]?.url ?? null;
}

export function JobDetailsPage({
  jobId,
  selectedFileName,
}: {
  jobId: string;
  selectedFileName?: string;
}) {
  const { data, isLoading, isError, error } = useGetJobDetailsQuery(jobId);

  const splatUrl = useMemo(
    () => pickSplatUrl(data?.output_files ?? [], selectedFileName),
    [data?.output_files, selectedFileName],
  );

  return (
    <div style={{ width: "100vw", height: "100vh", margin: 0, overflow: "hidden" }}>
      <div style={{ position: "relative", width: "100%", height: "100%", background: "#000" }}>
        <Link href="/jobs" style={{ position: "absolute", top: 16, left: 16, zIndex: 20 }}>
          <Button type="primary" shape="circle" icon={<ArrowLeftOutlined />} />
        </Link>

        {isLoading && (
          <div style={{ position: "absolute", top: 70, left: 16, zIndex: 20 }}>
            <Spin description="Loading job details..." />
          </div>
        )}

        {isError && (
          <div style={{ position: "absolute", top: 70, left: 16, zIndex: 20, maxWidth: 480 }}>
            <Alert
              type="error"
              showIcon
              message="Failed to load details"
              description={JSON.stringify(error)}
            />
          </div>
        )}

        {splatUrl && (
          <Canvas camera={{ position: [0, 0, 3], fov: 60 }}>
            <color attach="background" args={["#111111"]} />
            <ambientLight intensity={0.6} />

            <SparkViewer url={splatUrl} />

            <OrbitControls makeDefault enableDamping dampingFactor={0.12} />
          </Canvas>
        )}
      </div>
    </div>
  );
}
