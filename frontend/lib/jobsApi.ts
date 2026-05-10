import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import type { JobDetailsResponse, ListJobsResponse } from "@/lib/types/jobs";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_JOBS_API_BASE_URL?.replace(/\/$/, "") ??
  "http://localhost:8787";

export const jobsApi = createApi({
  reducerPath: "jobsApi",
  baseQuery: fetchBaseQuery({ baseUrl: apiBaseUrl }),
  endpoints: (builder) => ({
    listJobs: builder.query<
      ListJobsResponse,
      { limit?: number; offset?: number; status?: string } | void
    >({
      query: (params) => ({
        url: "/v1/jobs",
        params: params ?? undefined,
      }),
    }),
    getJobDetails: builder.query<JobDetailsResponse, string>({
      query: (jobId) => `/v1/jobs/${jobId}`,
    }),
  }),
});

export const { useListJobsQuery, useGetJobDetailsQuery } = jobsApi;
