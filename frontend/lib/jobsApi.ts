import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import type { JobDetailsResponse, ListJobsResponse } from "@/lib/types/jobs";

export const jobsApi = createApi({
  reducerPath: "jobsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "" }),
  endpoints: (builder) => ({
    listJobs: builder.query<
      ListJobsResponse,
      { limit?: number; offset?: number; status?: string } | void
    >({
      query: (params) => ({
        url: "/api/v1/jobs",
        params: params ?? undefined,
      }),
    }),
    getJobDetails: builder.query<JobDetailsResponse, string>({
      query: (jobId) => `/api/v1/jobs/${jobId}`,
    }),
  }),
});

export const { useListJobsQuery, useGetJobDetailsQuery } = jobsApi;
