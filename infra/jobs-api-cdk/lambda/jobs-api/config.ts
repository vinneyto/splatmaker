export const config = {
  tableName: process.env.JOBS_TABLE_NAME ?? "",
  jobDetailsTableName: process.env.JOB_DETAILS_TABLE_NAME ?? "",
  bucketName: process.env.RESULT_BUCKET_NAME ?? "",
  resultPublicBaseUrl: (process.env.RESULT_PUBLIC_BASE_URL ?? "").replace(
    /\/$/,
    "",
  ),
  presignTtlSeconds: Math.max(
    60,
    Math.min(86400, Number(process.env.PRESIGN_TTL_SECONDS ?? 3600)),
  ),
};

export const ensureEnv = () => {
  if (!config.tableName) throw new Error("JOBS_TABLE_NAME is not set");
  if (!config.jobDetailsTableName)
    throw new Error("JOB_DETAILS_TABLE_NAME is not set");
  if (!config.bucketName) throw new Error("RESULT_BUCKET_NAME is not set");
};
