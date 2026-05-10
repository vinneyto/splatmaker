"use client";

import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import Link from "next/link";
import { useMemo } from "react";

import { SparkViewer } from "@/components/spark/SparkViewer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 p-4">
      <Link href="/jobs" className="text-sm underline">
        ← Back to jobs
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Job details: {jobId}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {isLoading && (
            <p className="text-muted-foreground">Loading job details…</p>
          )}
          {isError && (
            <p className="text-red-500">
              Failed to load details: {JSON.stringify(error)}
            </p>
          )}

          {data && (
            <>
              <p>status: {data.summary.status}</p>
              <p>progress: {data.summary.progress_percent}%</p>
              <p>source_ref: {data.source_ref || "-"}</p>
              <p>started_at: {data.started_at || "-"}</p>
              <p>finished_at: {data.finished_at || "-"}</p>
              <p>default splat URL: {defaultSplatUrl || "not found"}</p>

              <div>
                <p className="mb-1 font-medium">Output files</p>
                <ul className="list-disc space-y-1 pl-5">
                  {data.output_files.map((f) => (
                    <li key={f.key}>
                      <a
                        href={f.url}
                        target="_blank"
                        rel="noreferrer"
                        className="underline"
                      >
                        {f.file_name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {defaultSplatUrl && (
        <div className="h-[70vh] w-full overflow-hidden rounded-xl border bg-black">
          <Canvas camera={{ position: [0, 0, 3], fov: 60 }}>
            <color attach="background" args={["#111111"]} />
            <ambientLight intensity={0.6} />

            <SparkViewer url={defaultSplatUrl} />

            <OrbitControls makeDefault enableDamping dampingFactor={0.12} />
          </Canvas>
        </div>
      )}
    </div>
  );
}
