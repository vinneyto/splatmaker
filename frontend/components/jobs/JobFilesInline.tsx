"use client";

import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { useGetJobDetailsQuery } from "@/lib/jobsApi";

export function JobFilesInline({ jobId }: { jobId: string }) {
  const [expanded, setExpanded] = useState(false);
  const { data, isFetching, isError, error } = useGetJobDetailsQuery(jobId, {
    skip: !expanded,
  });

  return (
    <details
      className="bg-transparent"
      onToggle={(event) =>
        setExpanded((event.currentTarget as HTMLDetailsElement).open)
      }
    >
      <summary className="flex w-fit cursor-pointer list-none items-center gap-1 py-1 text-sm font-medium text-zinc-900">
        Files
        <ChevronDown className="h-4 w-4" />
      </summary>

      <div className="pt-1">
        <div className="flex w-full flex-col gap-2">
          {isFetching && (
            <div className="flex items-center gap-2 text-sm text-zinc-600">
              <Spinner className="h-4 w-4" />
              <span>Loading files...</span>
            </div>
          )}

          {isError && (
            <Alert variant="destructive">
              <AlertTitle>Failed to load files</AlertTitle>
              <AlertDescription>{JSON.stringify(error)}</AlertDescription>
            </Alert>
          )}

          {!isFetching && !isError && (
            <ul className="m-0 list-disc pl-4 text-sm">
              {(data?.output_files ?? []).map((file) => (
                <li key={file.key}>
                  <Link
                    to={`/jobs/${jobId}?fileName=${encodeURIComponent(file.file_name)}`}
                    className="underline underline-offset-2"
                  >
                    {file.file_name}
                  </Link>
                </li>
              ))}
              {(data?.output_files.length ?? 0) === 0 && <li>No files</li>}
            </ul>
          )}
        </div>
      </div>
    </details>
  );
}
