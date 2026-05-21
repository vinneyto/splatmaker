import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import type {
  JobDetailsResponse,
  ListJobsResponse,
} from "@/app/_lib/types/jobs";

export const jobsApi = createApi({
  reducerPath: "jobsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/v1" }),
  endpoints: (builder) => ({
    listJobs: builder.query<
      ListJobsResponse,
      { limit?: number; offset?: number; status?: string } | void
    >({
      query: (params) => ({
        url: "/jobs",
        params: params ?? undefined,
      }),
    }),
    getJobDetails: builder.query<JobDetailsResponse, string>({
      query: (jobId) => `/jobs/${jobId}`,
    }),
  }),
});

export const { useListJobsQuery, useGetJobDetailsQuery } = jobsApi;
