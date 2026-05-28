"use client";

import { useEffect, useState } from "react";
import { JobCard } from "@/app/_components/jobs/JobCard";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/app/_components/ui/alert";
import { Spinner } from "@/app/_components/ui/spinner";
import { useListJobsQuery } from "@/app/_lib/jobsApi";
import {
  completeCognitoLoginIfNeeded,
  loadSession,
  loginWithCognito,
  logoutFromCognito,
} from "@/app/_lib/cognitoAuth";

export function JobsListPage() {
  const { data, isLoading, isError, error } = useListJobsQuery({ limit: 100 });
  const [accountId, setAccountId] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        const existing = loadSession();
        if (existing && !cancelled) {
          setAccountId(existing.accountId);
        }

        const sessionAfterExchange = await completeCognitoLoginIfNeeded();
        if (!cancelled && sessionAfterExchange) {
          setAccountId(sessionAfterExchange.accountId);
        }
      } catch (err) {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : "Unknown auth error";
          setAuthError(message);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex w-full justify-center">
      <div className="w-full max-w-[1000px] p-4">
        <div className="flex w-full flex-col gap-5">
          <div className="flex items-center justify-between gap-3">
            <h1 className="m-0 text-2xl font-semibold tracking-tight">Jobs</h1>

            <div className="flex items-center gap-2 text-sm">
              {accountId ? (
                <>
                  <span className="rounded-md border px-2 py-1 text-zinc-700">
                    account: {accountId}
                  </span>
                  <button
                    type="button"
                    className="rounded-md border px-3 py-1.5"
                    onClick={() => {
                      logoutFromCognito();
                      setAccountId(null);
                    }}
                  >
                    Log out
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="rounded-md border px-3 py-1.5"
                  onClick={() => {
                    void loginWithCognito().catch((err: unknown) => {
                      const message =
                        err instanceof Error ? err.message : "Unknown auth error";
                      setAuthError(message);
                    });
                  }}
                >
                  Log in
                </button>
              )}
            </div>
          </div>

          {authError && (
            <Alert variant="destructive">
              <AlertTitle>Auth error</AlertTitle>
              <AlertDescription>{authError}</AlertDescription>
            </Alert>
          )}

          {isLoading && (
            <div className="flex items-center gap-2 text-zinc-600">
              <Spinner />
              <span>Loading jobs...</span>
            </div>
          )}

          {isError && (
            <Alert variant="destructive">
              <AlertTitle>Failed to load jobs</AlertTitle>
              <AlertDescription>{JSON.stringify(error)}</AlertDescription>
            </Alert>
          )}

          {!isLoading && !isError && (data?.items.length ?? 0) === 0 && (
            <Alert>
              <AlertTitle>No jobs found</AlertTitle>
            </Alert>
          )}

          {!isError && (
            <div className="flex w-full flex-col gap-4">
              {(data?.items ?? []).map((job) => (
                <div key={job.job_id} className="w-full">
                  <JobCard job={job} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
