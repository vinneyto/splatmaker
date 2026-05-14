import { JobRow, JobStatus, JobSummary } from "./types.js";
import { trimTrailingSlash } from "./strings.js";

const STATUS_MAP = new Map<string, JobStatus>([
  ["in-progress", "in-progress"],
  ["complete", "complete"],
  ["error", "error"],
  ["cancelled", "cancelled"],
]);

export const normalizeStatus = (raw: unknown): JobStatus => {
  const key = String(raw ?? "")
    .trim()
    .toLowerCase();
  return STATUS_MAP.get(key) ?? "unknown";
};

export const toIso = (raw: unknown): string | null => {
  const s = String(raw ?? "").trim();
  if (!s) return null;

  const n = Number(s);
  if (Number.isFinite(n) && /^\d+$/.test(s)) {
    return new Date(n * 1000).toISOString();
  }

  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
};

export const inferProgressPercent = (status: JobStatus): number => {
  const s = String(status ?? "").trim().toLowerCase();
  if (s === "complete") return 100;
  if (s === "in-progress") return 50;
  if (s === "error" || s === "cancelled") return 0;
  return 0;
};

export const inferOutputPrefixes = (row: JobRow): string[] => {
  const basePrefixRaw = String(row.s3Output ?? "").trim();
  if (!basePrefixRaw) return [];

  const noScheme = basePrefixRaw.replace(/^s3:\/\//, "");
  const slash = noScheme.indexOf("/");
  if (slash < 0) return [];

  const basePrefix = trimTrailingSlash(noScheme.slice(slash + 1));
  if (!basePrefix) return [];

  const jobId = String(row.uuid ?? "").trim();
  if (!jobId) return [];

  return [`${basePrefix}/${jobId}`];
};

export const toSummary = (row: JobRow): JobSummary => {
  const status = normalizeStatus(row.uuidStatus);
  const updatedAt =
    toIso(row.updatedAt) ??
    toIso(row.endTimestamp) ??
    toIso(row.startTimestamp) ??
    new Date().toISOString();
  const createdAt = toIso(row.startTimestamp) ?? updatedAt;

  return {
    job_id: String(row.uuid ?? ""),
    status,
    progress_percent: inferProgressPercent(status),
    created_at: createdAt,
    updated_at: updatedAt,
  };
};
