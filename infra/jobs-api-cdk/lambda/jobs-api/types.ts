export type JobRow = Record<string, unknown>;

export type JobStatus = 'queued' | 'running' | 'succeeded' | 'failed' | 'canceled';

export type OutputFile = {
  key: string;
  file_name: string;
  url: string;
  expires_at?: string;
};

export type JobSummary = {
  job_id: string;
  status: JobStatus;
  progress_percent: number;
  created_at: string;
  updated_at: string;
};
