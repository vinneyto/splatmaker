export type JobStatus =
  | "queued"
  | "running"
  | "succeeded"
  | "failed"
  | "canceled"
  | (string & {});

export type JobSummary = {
  job_id: string;
  status: JobStatus;
  progress_percent: number;
  created_at: string;
  updated_at: string;
};

export type OutputFile = {
  key: string;
  file_name: string;
  url: string;
  expires_at?: string;
};

export type ListJobsResponse = {
  items: JobSummary[];
};

export type JobDetailsResponse = {
  summary: JobSummary;
  attempt: number;
  source_ref: string;
  error_message?: string;
  started_at?: string | null;
  finished_at?: string | null;
  output_files: OutputFile[];
};
